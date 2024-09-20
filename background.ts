let debounceTimeout: NodeJS.Timeout | null = null;

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (typeof msg.text === "string") {
    chrome.storage.local.set({ saving: true }, () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(() => {
        chrome.storage.local.set({ input: msg }, async () => {
          chrome.storage.local.set({ saving: false });
          await chrome.runtime.sendMessage({ refresh: true });
        });
      }, 1000);
    });
  }
});
