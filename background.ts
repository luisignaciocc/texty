let debounceTimeout: NodeJS.Timeout | null = null;

chrome.runtime.onMessage.addListener(async (msg) => {
  if (typeof msg.text === "string") {
    try {
      await chrome.storage.local.set({ input: msg });
      await chrome.runtime.sendMessage({ refresh: true });
    } catch (error) {}
  }
});
