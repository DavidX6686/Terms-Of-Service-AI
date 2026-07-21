/* ClauseGuard content script.
 * Runs on every page, looks for Terms of Service signals, and shows an
 * in-page popup when it finds one. Detection covers three cases:
 *   1. The page itself is a ToS document.
 *   2. The page contains links to a ToS document.
 *   3. The page has an "I agree to the terms" checkbox (e.g. signup forms).
 */
(() => {
  "use strict"

  const TOS_PHRASES = [
    "terms of service",
    "terms of use",
    "terms and conditions",
    "terms & conditions",
    "terms of sale",
    "user agreement",
    "conditions of use",
  ]

  const AGREE_PHRASES = ["i agree", "i accept", "agree to the", "accept the"]

  // Avoid showing the popup more than once per page load.
  let popupShown = false

  function normalize(text) {
    return (text || "").toLowerCase().replace(/\s+/g, " ").trim()
  }

  function matchesTos(text) {
    const t = normalize(text)
    return TOS_PHRASES.find((p) => t.includes(p)) || null
  }

  // 1. Is this page itself a Terms of Service document?
  function detectTosPage() {
    const url = normalize(location.href)
    if (/terms|tos|conditions|user-agreement|eula/.test(url)) {
      return { type: "page", label: document.title || "This page" }
    }
    const heading = document.querySelector("h1, h2")
    if (heading && matchesTos(heading.textContent)) {
      return { type: "page", label: normalize(heading.textContent) }
    }
    return null
  }

  // 2. Links pointing at a ToS document.
  function detectTosLinks() {
    const anchors = Array.from(document.querySelectorAll("a[href]"))
    const hits = []
    for (const a of anchors) {
      const phrase = matchesTos(a.textContent) || matchesTos(a.getAttribute("href"))
      if (phrase) {
        hits.push({ href: a.href, label: normalize(a.textContent) || phrase })
      }
    }
    return hits.length ? { type: "link", hits } : null
  }

  // 3. "I agree to the terms" checkboxes.
  function detectAgreeCheckbox() {
    const checkboxes = Array.from(document.querySelectorAll('input[type="checkbox"]'))
    for (const cb of checkboxes) {
      // Look at the checkbox's own labels and nearby text.
      const labelText =
        (cb.labels && Array.from(cb.labels).map((l) => l.textContent).join(" ")) ||
        (cb.closest("label") ? cb.closest("label").textContent : "") ||
        (cb.parentElement ? cb.parentElement.textContent : "")
      const t = normalize(labelText)
      const mentionsAgree = AGREE_PHRASES.some((p) => t.includes(p))
      const mentionsTos = matchesTos(t)
      if (mentionsAgree && mentionsTos) {
        return { type: "checkbox", label: matchesTos(t) }
      }
    }
    return null
  }

  function detect() {
    // Priority: an explicit agreement checkbox is the strongest signal,
    // then a full ToS page, then plain links.
    return detectAgreeCheckbox() || detectTosPage() || detectTosLinks()
  }

  function buildDescription(result) {
    if (result.type === "page") {
      return "You're viewing a Terms of Service document. Scan it for risky clauses before you agree."
    }
    if (result.type === "checkbox") {
      return "This page is asking you to agree to Terms of Service. Scan them before you check the box."
    }
    return `Found ${result.hits.length} Terms of Service link${
      result.hits.length > 1 ? "s" : ""
    } on this page. Scan them so you know what you're agreeing to.`
  }

  function showPopup(result) {
    if (popupShown) return
    popupShown = true

    const host = document.createElement("div")
    host.id = "clauseguard-popup-root"
    document.documentElement.appendChild(host)

    const card = document.createElement("div")
    card.className = "cg-card"
    card.setAttribute("role", "dialog")
    card.setAttribute("aria-label", "ClauseGuard Terms of Service detected")

    card.innerHTML = `
      <div class="cg-header">
        <div class="cg-badge">ToS detected</div>
        <button class="cg-close" aria-label="Dismiss">&times;</button>
      </div>
      <h2 class="cg-title">Terms of Service found on ${normalize(location.hostname)}</h2>
      <p class="cg-desc">${buildDescription(result)}</p>
      <div class="cg-actions">
        <button class="cg-btn cg-btn-primary" data-action="scan">Scan now</button>
        <button class="cg-btn cg-btn-secondary" data-action="track">Track this site</button>
        <button class="cg-btn cg-btn-ghost" data-action="ignore">Not now</button>
      </div>
    `

    host.appendChild(card)

    const close = () => host.remove()
    card.querySelector(".cg-close").addEventListener("click", close)
    card.querySelector('[data-action="ignore"]').addEventListener("click", close)

    card.querySelector('[data-action="scan"]').addEventListener("click", () => {
      chrome.runtime.sendMessage({
        type: "cg-scan",
        url: location.href,
        host: location.hostname,
      })
      card.querySelector(".cg-desc").textContent = "Scan queued. Open the ClauseGuard popup to see results."
      card.querySelector(".cg-actions").innerHTML =
        '<button class="cg-btn cg-btn-primary" data-action="ok">Got it</button>'
      card.querySelector('[data-action="ok"]').addEventListener("click", close)
    })

    card.querySelector('[data-action="track"]').addEventListener("click", () => {
      chrome.runtime.sendMessage({
        type: "cg-track",
        url: location.href,
        host: location.hostname,
      })
      const btn = card.querySelector('[data-action="track"]')
      btn.textContent = "Tracking ✓"
      btn.disabled = true
    })
  }

  // Run detection once the page has settled.
  const result = detect()
  if (result) {
    showPopup(result)
  }
})()
