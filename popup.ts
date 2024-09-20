document.addEventListener("DOMContentLoaded", async () => {
  const textArea = document.getElementById("input") as HTMLTextAreaElement;

  const inputText = await chrome.storage.local.get("input");

  textArea.value = inputText.input.text || "";

  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.refresh) {
      const inputText = await chrome.storage.local.get("input");
      textArea.value = inputText.input.text || "";
    }
  });
});
