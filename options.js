const input = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("siteList");
const hint = document.getElementById("hint");

function normalizeToHost(value) {
  let v = (value || "").trim().toLowerCase();
  if (!v) return "";
  try {
    if (!/^https?:\/\//.test(v)) v = "http://" + v;
    const u = new URL(v);
    return u.hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function showHint(msg) {
  hint.textContent = msg;
  hint.hidden = !msg;
}

function renderList(sites) {
  list.innerHTML = "";

  if (!sites.length) {
    const empty = document.createElement("div");
    empty.className = "site-item";
    empty.style.justifyContent = "center";
    empty.style.color = "#a0a0a0";
    empty.textContent = "No sites blocked";
    list.appendChild(empty);
    return;
  }

  sites.forEach((site, index) => {
    const li = document.createElement("li");
    li.className = "site-item";

    const span = document.createElement("span");
    span.className = "site-host";
    span.textContent = site;

    const btn = document.createElement("button");
    btn.className = "remove-btn";
    btn.title = "Remove site";
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      Remove
    `;
    btn.addEventListener("click", () => {
      sites.splice(index, 1);
      chrome.storage.sync.set({ blockedSites: sites });
      renderList(sites);
    });

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

function addCurrent() {
  const host = normalizeToHost(input.value);
  if (!host) {
    showHint("Please enter a valid domain, for example reddit.com");
    return;
  }
  chrome.storage.sync.get({ blockedSites: [] }, ({ blockedSites }) => {
    if (blockedSites.includes(host)) {
      showHint("That domain is already blocked.");
      return;
    }
    blockedSites.push(host);
    chrome.storage.sync.set({ blockedSites }, () => {
      input.value = "";
      showHint("");
      renderList(blockedSites);
    });
  });
}

addBtn.addEventListener("click", addCurrent);
input.addEventListener("keydown", e => { if (e.key === "Enter") addCurrent(); });

chrome.storage.sync.get({ blockedSites: [] }, ({ blockedSites }) => {
  renderList(blockedSites);
});
