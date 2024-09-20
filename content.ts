function main() {
  try {
    const inputObserver = new MutationObserver(async (mutationsList) => {
      const activeElement = document.activeElement as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA")
      ) {
        const text = activeElement.value;
        await chrome.runtime.sendMessage({ text });
      }
    });

    const observeActiveElement = () => {
      const activeElement = document.activeElement as
        | HTMLInputElement
        | HTMLTextAreaElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA")
      ) {
        inputObserver.observe(activeElement, {
          attributes: true,
          characterData: true,
          childList: true,
          subtree: true,
        });
      }
    };

    const documentObserver = new MutationObserver(() => {
      inputObserver.disconnect();
      observeActiveElement();
    });

    documentObserver.observe(document, { subtree: true, childList: true });

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "start") {
        observeActiveElement();
      }
    });
  } catch (error) {
    return;
  }
}

main();
