function buildRules(blockedSites) {
  return blockedSites.map((site, idx) => ({
    id: idx + 1,
    priority: 1,
    action: { type: "redirect", redirect: { extensionPath: "/index.html" } },
    condition: { urlFilter: site, resourceTypes: ["main_frame"] }
  }));
}

async function updateRulesFromStorage() {
  const { blockedSites = [] } = await chrome.storage.sync.get({ blockedSites: [] });
  const newRules = buildRules(blockedSites);

  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  const toRemove = existing.map(r => r.id);

  await chrome.declarativeNetRequest.updateDynamicRules({
    addRules: newRules,
    removeRuleIds: toRemove
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const { blockedSites } = await chrome.storage.sync.get({ blockedSites: [] });
  if (!Array.isArray(blockedSites)) {
    await chrome.storage.sync.set({ blockedSites: [] });
  }
  await updateRulesFromStorage();
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.blockedSites) {
    updateRulesFromStorage();
  }
});
