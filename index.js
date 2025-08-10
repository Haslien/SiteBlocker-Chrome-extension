document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("openSettings");
  if (btn) {
    btn.addEventListener("click", () => {
      if (chrome?.runtime?.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      } else {
        // Fallback
        window.open(chrome.runtime.getURL("options.html"));
      }
    });
  }
});
