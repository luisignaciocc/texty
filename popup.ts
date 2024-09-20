document.addEventListener("DOMContentLoaded", async () => {
  const textArea = document.getElementById("input") as HTMLTextAreaElement;
  const inputText = await chrome.storage.local.get("input");
  textArea.value = inputText.input.text || "";

  const apiKey = await chrome.storage.sync.get("apiKey");

  if (apiKey.apiKey) {
    (document.getElementById("apiKey") as HTMLInputElement).value =
      apiKey.apiKey;
  }

  chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.refresh) {
      const inputText = await chrome.storage.local.get("input");
      textArea.value = inputText.input.text || "";
    }
  });

  document.getElementById("btn").addEventListener("click", async () => {
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

    await chrome.storage.sync.set({ apiKey });

    if (!inputText) {
      alert("Please enter some text");
      return;
    }

    const systemPrompt =
      "You are an advanced text assistant using the OpenAI API to reformulate texts. Your task is to generate clear and coherent text based on user specifications, including domain, intent, audience, formality, and language. Ensure you follow the user's instructions and provide useful and creative results. Return only the reformulated text, without any additional information or commentary.";

    const userPrompt = `
      Reformulate the following text for a ${audience} audience in a ${domain} context, with the intent to ${intent}, in a ${formality} tone, and in ${language}: "${inputText}"
    `;

    const output = document.getElementById("output") as HTMLTextAreaElement;
    if (output) {
      output.value = "Loading...";

      try {
        //       curl https://api.openai.com/v1/chat/completions \
        // -H "Content-Type: application/json" \
        // -H "Authorization: Bearer $OPENAI_API_KEY" \
        // -d '{
        //    "model": "gpt-4o-mini",
        //    "messages": [{"role": "user", "content": "Say this is a test!"}],
        //    "temperature": 0.7
        //  }'
        const completion = await fetch(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
              ],
              temperature: 0.7,
            }),
          }
        ).then((response) => response.json());

        const reformulatedText =
          completion?.choices?.[0]?.message?.content?.replace(/^"|"$/g, "");
        output.value = reformulatedText;
      } catch (error) {
        output.value = "An error occurred. Please try again.";
      }
    }
  });
});
