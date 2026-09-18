# Privacy Policy for Texty

Texty is a Chrome extension that reformulates text using the Google
Gemini API. This policy explains what data it handles and why.

## What Texty stores

- **Gemini API key**: the key you enter is stored locally in your
  browser's extension storage (`chrome.storage.local`). It is never
  sent anywhere except directly to Google's Gemini API, as the
  `x-goog-api-key` header of your own requests.
- **Input text**: the text you type into the popup is stored locally
  so it persists across popup opens/closes, and is cleared when you
  switch tabs.

None of this data is transmitted to, or collected by, the developer of
Texty. There is no backend server, analytics, or tracking of any kind.

## What Texty sends to third parties

When you click "Go", the text you entered — along with the domain,
intent, audience, formality, and language you selected — is sent
directly from your browser to Google's Generative Language API
(`generativelanguage.googleapis.com`) using your own API key, to
generate the reformulated text. That request is subject to
[Google's Gemini API terms and privacy policy](https://ai.google.dev/gemini-api/terms).

## Content script

Texty's content script reads the currently focused input field,
textarea, or editable element on the page you're viewing, so its
contents can populate the popup. This happens locally in your browser
and is not transmitted anywhere except as described above, if you
choose to reformulate that text.

## Contact

Questions about this policy can be opened as an issue on the
[Texty GitHub repository](https://github.com/luisignaciocc/texty).
