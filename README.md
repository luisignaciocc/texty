# Texty

Texty is a text assistant extension designed to help you write better by reformulating text based on user specifications. It utilizes Google's Gemini 3.6 Flash model to generate coherent and contextually appropriate text.

## Features

- Text Reformulation: Reformulate text for various domains, intents, audiences, formalities, and languages.
- Customizable Inputs: Enter your Gemini API key, input text, and select preferences for domain, intent, audience, formality, and language.
- User-Friendly Interface: Simple and intuitive popup interface for easy interaction.

## Installation

1. Download the extension files.
2. Run `npm build` to compile the TypeScript files and prepare the extension for use.
3. Open Chrome and go to chrome://extensions/.
4. Enable "Developer mode" in the top right corner.
5. Click on "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the Texty extension icon in the toolbar.
2. Enter your Gemini API key.
3. Input the text you want to reformulate.
4. Select the desired domain, intent, audience, formality, and language.
5. Click the "Go" button to get the reformulated text.

## Files Overview

- manifest.json: Configuration file for the extension.
- popup.html: The HTML structure for the popup interface.
- popup.ts: Logic for handling user input and interaction in the popup.
- content.ts: Monitors input elements on web pages to capture text.
- background.ts: Handles background processes and messaging.

## Requirements

- A Google AI Studio account to obtain a Gemini API key.

## CI/CD: Publishing to the Chrome Web Store

`.github/workflows/publish.yml` builds, packages, and publishes a new
version to the Chrome Web Store whenever `master` is updated (via a
merged pull request — direct pushes to `master` are blocked by branch
protection). The publish job targets the `chrome-web-store` GitHub
Environment, which requires a manual approval click before it runs, so
a merge alone never sends a version to Google for review — someone
still has to approve the deployment in the Actions run.

To reuse this pattern in another workflow or repo, you need:

1. **A Google Cloud project with the Chrome Web Store API enabled**
   (APIs & Services → Library → "Chrome Web Store API" → Enable).
2. **An OAuth2 client** (APIs & Services → Credentials → Create
   Credentials → OAuth client ID → type "Web application", with
   `https://developers.google.com/oauthplayground` as an authorized
   redirect URI). On the OAuth consent screen, add the Google account
   that owns the Web Store listing as a **test user** — otherwise the
   refresh token expires after 7 days.
3. **A refresh token**, obtained once via the
   [OAuth 2.0 Playground](https://developers.google.com/oauthplayground):
   use your own OAuth credentials from step 2, authorize the scope
   `https://www.googleapis.com/auth/chromewebstore`, and exchange the
   authorization code for tokens.
4. **Your publisher ID**, from the Chrome Web Store Developer
   Dashboard's account settings.
5. **The extension ID**, from the extension's page in the Developer
   Dashboard.

Store these as repository secrets (`gh secret set NAME --repo owner/repo`,
entered interactively so the value never touches shell history or logs):

| Secret                 | Value                                   |
| ----------------------- | ---------------------------------------- |
| `CHROME_EXTENSION_ID`   | Extension ID                             |
| `CHROME_CLIENT_ID`      | OAuth2 client ID                         |
| `CHROME_CLIENT_SECRET`  | OAuth2 client secret                     |
| `CHROME_REFRESH_TOKEN`  | OAuth2 refresh token                     |
| `CHROME_PUBLISHER_ID`   | Chrome Web Store publisher ID            |

The workflow uploads and publishes with
[`chrome-webstore-upload-cli`](https://www.npmjs.com/package/chrome-webstore-upload-cli),
which reads `EXTENSION_ID`, `CLIENT_ID`, `CLIENT_SECRET`,
`REFRESH_TOKEN`, and `PUBLISHER_ID` from the environment (the CLI
dropped the equivalent `--client-id`/`--client-secret`/`--refresh-token`
flags in v4, and requires `--publisher-id`/`PUBLISHER_ID` as of the
same version).

To require manual approval on a new environment like `chrome-web-store`:

```bash
gh api -X PUT repos/OWNER/REPO/environments/ENV_NAME \
  -f 'reviewers[][type]=User' \
  -F 'reviewers[][id]=YOUR_GITHUB_USER_ID' \
  -F 'deployment_branch_policy[protected_branches]=true' \
  -F 'deployment_branch_policy[custom_branch_policies]=false'
```

Then reference it in the job with `environment: ENV_NAME`. Note this
only works if the branch the job runs on is a **protected branch**
(see branch protection below).

## Branch protection

`master` requires all changes to go through a pull request (direct
pushes are rejected, including for repo admins) via:

```bash
gh api -X PUT repos/OWNER/REPO/branches/master/protection --input - <<'EOF'
{
  "required_status_checks": null,
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": false
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false
}
EOF
```

`required_approving_review_count` is `0` since this is a solo-maintainer
repo — a pull request is still mandatory, but it doesn't need a second
reviewer's approval to merge.

## License

This project is licensed under the MIT License.
