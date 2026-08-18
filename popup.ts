document.addEventListener("DOMContentLoaded", async () => {
  const textArea = document.getElementById("input") as HTMLTextAreaElement;
  const inputText = await chrome.storage.local.get("input");
  textArea.value = inputText.input?.text || "";

  const apiKey = await chrome.storage.local.get("apiKey");

  if (apiKey.apiKey) {
    (document.getElementById("apiKey") as HTMLInputElement).value =
      apiKey.apiKey;
  }

  chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.refresh) {
      const inputText = await chrome.storage.local.get("input");
      textArea.value = inputText.input?.text || "";
    }
  });

  const btn = document.getElementById("btn") as HTMLButtonElement;
  btn?.addEventListener("click", async () => {
    const apiKey = (document.getElementById("apiKey") as HTMLInputElement)
      ?.value;
    const inputText = (document.getElementById("input") as HTMLTextAreaElement)
      ?.value;
    const domain = (document.getElementById("domain") as HTMLSelectElement)
      ?.value;
    const intent = (document.getElementById("intent") as HTMLSelectElement)
      ?.value;
    const audience = (document.getElementById("audience") as HTMLSelectElement)
      ?.value;
    const formality = (
      document.getElementById("formality") as HTMLSelectElement
    )?.value;
    const language = (document.getElementById("language") as HTMLSelectElement)
      ?.value;

    if (!apiKey) {
      alert("Please enter your API key");
      return;
    }

    await chrome.storage.local.set({ apiKey });

    if (!inputText) {
      alert("Please enter some text");
      return;
    }

    const systemPrompt =
      "You are an advanced text assistant using the Gemini API to reformulate texts. Your task is to generate clear and coherent text based on user specifications, including domain, intent, audience, formality, and language. Ensure you follow the user's instructions and provide useful and creative results. Return only the reformulated text, without any additional information or commentary.";

    const userPrompt = `
      Reformulate the following text for a ${audience} audience in a ${domain} context, with the intent to ${intent}, in a ${formality} tone, and in ${language}: "${inputText}"
    `;

    const output = document.getElementById("output") as HTMLTextAreaElement;
    if (output) {
      output.value = "Loading...";
      btn.disabled = true;

      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": apiKey,
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: userPrompt }] }],
              generationConfig: { temperature: 0.7 },
            }),
          }
        );

        const completion = await response.json();

        if (!response.ok) {
          throw new Error(
            completion?.error?.message ||
              `Request failed with status ${response.status}`
          );
        }

        const reformulatedText = completion?.candidates?.[0]?.content
          ?.parts?.[0]?.text
          ?.trim()
          ?.replace(/^"|"$/g, "");

        output.value = reformulatedText || "No response received. Please try again.";
      } catch (error) {
        output.value = `An error occurred: ${
          error instanceof Error ? error.message : "Please try again."
        }`;
      } finally {
        btn.disabled = false;
      }
    }
  });

  const debouncedSaveInputText = (text: string) => {
    chrome.storage.local.set({ input: { text } });
  };
  let timeout: NodeJS.Timeout | null = null;
  textArea.addEventListener("input", (event) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      debouncedSaveInputText(textArea.value);
    }, 500);
  });

  const saveApiKey = (apiKey: string) => {
    chrome.storage.local.set({ apiKey });
  };
  let apiKeyTimeout: NodeJS.Timeout | null = null;
  const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;
  apiKeyInput.addEventListener("input", (event) => {
    if (apiKeyTimeout) {
      clearTimeout(apiKeyTimeout);
    }

    apiKeyTimeout = setTimeout(() => {
      saveApiKey(apiKeyInput.value);
    }, 500);
  });
});
