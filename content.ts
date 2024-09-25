function main() {
  try {
    const inputObserver = new MutationObserver(async (mutationsList) => {
      const activeElement = document.activeElement as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLDivElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement.tagName === "DIV" && activeElement.isContentEditable))
      ) {
        const text =
          "value" in activeElement
            ? activeElement.value ||
              activeElement.innerText ||
              activeElement.textContent
            : activeElement.innerText || activeElement.textContent;
        await chrome.runtime.sendMessage({ text });
      }
    });

    const observeActiveElement = () => {
      const activeElement = document.activeElement as
        | HTMLInputElement
        | HTMLTextAreaElement
        | HTMLDivElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement.tagName === "DIV" && activeElement.isContentEditable))
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
