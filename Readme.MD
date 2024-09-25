# Texty

Texty is a text assistant extension designed to help you write better by reformulating text based on user specifications. It utilizes OpenAI's gpt-4o-mini model to generate coherent and contextually appropriate text.

## Features

- Text Reformulation: Reformulate text for various domains, intents, audiences, formalities, and languages.
- Customizable Inputs: Enter your OpenAI API key, input text, and select preferences for domain, intent, audience, formality, and language.
- User-Friendly Interface: Simple and intuitive popup interface for easy interaction.

## Installation

1. Download the extension files.
2. Run `npm build` to compile the TypeScript files and prepare the extension for use.
3. Open Chrome and go to chrome://extensions/.
4. Enable "Developer mode" in the top right corner.
5. Click on "Load unpacked" and select the directory containing the extension files.

## Usage

1. Click on the Texty extension icon in the toolbar.
2. Enter your OpenAI API key.
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

- An OpenAI account to obtain an API key.

## License

This project is licensed under the MIT License.
