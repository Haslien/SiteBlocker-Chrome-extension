chrome.storage.sync.get("blockedSites", ({ blockedSites }) => {
  const currentUrl = window.location.href;

  if (blockedSites.some(site => currentUrl.startsWith(site))) {
    fetch(chrome.runtime.getURL("index.html"))
      .then(res => res.text())
      .then(html => {
        document.documentElement.innerHTML = html;
        document.documentElement.style.height = "100%";
      });
  }
});
