# Dice Roller

A simple dice roller web application that allows you to roll one or more dice with a customizable number of sides. The application includes animations for rolling and shaking the dice, along with a feature to lock individual dice using a long press.

## Features

- Roll one or more standard dice
- Supports D4, D6, D8, D10, D12 and D20
- Special dice presets for games that use custom dice
- Visual animation for rolling and shaking the dice
- Long press to lock/unlock individual dice
- Responsive UI for desktop and mobile
- Offline support as a Progressive Web App

## Special dice

In addition to standard numeric dice, Dice Roller supports presets for games that use custom dice.

Currently available:

- **King of Tokyo** – six dice with numbers, hearts, energy and smash symbols

Special dice are intended to replace the physical dice only. Dice Roller does not implement game rules, scoring or other game mechanics.

## Usage

1. [Open the application in your web browser](https://tehes.github.io/dice-roller/).
2. **Click** on the dice to roll them. The dice will animate and display the result.
3. **Long press** on a die to lock/unlock it. Locked dice will not be rolled until unlocked.
4. Use the **hamburger menu** to toggle the sidebar with additional settings.
5. Use the **slider** to select the number of dice.
6. Choose the **number of sides** for the dice from the dropdown.

## Offline Support

The app is a Progressive Web App (PWA), meaning you can use it offline after the initial load. The service worker caches important files, so you can roll and lock dice anytime, anywhere.

## License and usage

This project is source-available, not open source.

You may view and modify the code for personal, educational, and non-commercial purposes.

If you publicly redistribute this project or a modified version of it, you must:

- link to the original project repository
- include a visible attribution to the original project and author, where technically and contextually appropriate
- clearly mark your version as modified and unofficial

Commercial use, paid hosting, resale, and misleading rebranding are not allowed without prior written permission.
