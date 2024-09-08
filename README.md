# Dice Roller

A simple dice roller web application that allows you to roll one or more dice with a customizable number of sides. The application includes animations for rolling and shaking the dice, along with a feature to lock individual dice using a long press.

## Features

- Roll a random number of dice (between 1 and 6)
- Customize the number of sides on the dice (e.g., 6-sided, 20-sided)
- Visual animation for dice rolling and shaking
- Long press to lock/unlock individual dice
- Sidebar menu to control settings
- Responsive UI for desktop and mobile

## Usage

1. [Open the application in your web browser](https://tehes.github.io/dice-roller/).
2. **Click** on the dice to roll them. The dice will animate and display the result.
3. **Long press** on a die to lock/unlock it. Locked dice will not be rolled until unlocked.
4. Use the **hamburger menu** to toggle the sidebar with additional settings.
5. Use the **slider** to select the number of dice.
6. Choose the **number of sides** for the dice from the dropdown.

## Offline Support

The app is a Progressive Web App (PWA), meaning you can use it offline after the initial load. The service worker caches important files, so you can roll and lock dice anytime, anywhere.