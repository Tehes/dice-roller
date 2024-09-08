/* -------------------- Helper functions -------------------- */
// Removes all child elements from an HTMLElement
HTMLElement.prototype.empty = function () {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

// Returns a random integer between min (inclusive) and max (inclusive)
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* --------------------------------------------------------------------------------------------------
Variables
---------------------------------------------------------------------------------------------------*/
// Select all elements representing the faces of the dice
const diceFaces = document.querySelectorAll(".face");
let numberOfDice = getRndInteger(1, 6); // Initialize number of dice randomly
const menuButton = document.querySelector("#hamburger");
const sidebar = document.querySelector("nav");
const slider = document.querySelector("#slider");
slider.value = numberOfDice;
const sides = document.querySelector("select");
let maxSides = 6; // Default number of sides is 6
sides.value = maxSides;
let pressTimer; // Timer to detect long press
let pressStartTime; // Variable to store the start time of mousedown
const longPressThreshold = 500; // Threshold to define long press
// Detect if the device supports touch inputs
// 'ontouchstart' checks for touch events, and maxTouchPoints checks for the number of touch points
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints;

/* --------------------------------------------------------------------------------------------------
functions
---------------------------------------------------------------------------------------------------*/
// Clears and renders dice faces based on the number of dice and the number of sides
function renderDice() {
    diceFaces.forEach(function (face) {
        face.empty(); // Clear the face content
    });

    for (let i = 0; i < numberOfDice; i++) {
        renderPips(diceFaces[i]); // Add pips or digits to the dice faces
    }
}

// Generates and renders the pips (or digit) for a die
function renderPips(die) {
    die.empty(); // Clear the face element
    const randNum = getRndInteger(1, maxSides);

    if (maxSides === 6) {
        // Create the pips for a traditional 6-sided die
        for (let i = 0; i < randNum; i++) {
            const pip = document.createElement("span");
            pip.classList.add("pip");
            die.appendChild(pip);
        }
    } else {
        // Display a digit instead of pips for dice with more than 6 sides
        const digit = document.createElement("span");
        digit.classList.add("digit");
        digit.textContent = randNum;
        die.appendChild(digit);
    }
}

// Rolls the dice after a short delay and renders the new pips
function startRoll(ev) {
    const die = ev.currentTarget || ev;
    window.setTimeout(renderPips.bind(null, die), 350);
}

// Starts the shake animation for the dice
function startShakeDice() {
    const pressDuration = Date.now() - pressStartTime;

    // Only trigger dice roll if the press was short
    if (pressDuration < longPressThreshold) {
        diceFaces.forEach(function (face) {
            if (!face.classList.contains("locked")) { // Only animate unlocked dice
                face.classList.add("animated");
            }
        });
    }
}

// Stops the shake animation for the dice
function stopShakeDice() {
    diceFaces.forEach(function (face) {
        face.classList.remove("animated");
    });
}

// Locks/unlocks dice on long press
function lockDice(ev) {
    const die = ev.currentTarget;

    pressStartTime = Date.now(); // Record the time when mousedown starts

    pressTimer = window.setTimeout(function () {
        ev.preventDefault(); // Prevent context menus or text selection
        die.classList.toggle("locked"); // Toggle locked status on long press
    }, longPressThreshold); // Long press time threshold
}

// Cancels the long press if mouseup happens before threshold
function cancelLongPress(ev) {
    clearTimeout(pressTimer);

    const pressDuration = Date.now() - pressStartTime;
    if (pressDuration >= longPressThreshold) {
        ev.stopImmediatePropagation(); // Stop the click event if long press was triggered
    }
}

// Toggles the visibility of the sidebar
function toggleSidebar() {
    sidebar.classList.toggle("open");
}

// Updates the number of dice and the number of sides, then re-renders the dice
function setOptions() {
    numberOfDice = slider.value;
    maxSides = parseInt(sides.value);
    renderDice();
}

// Initializes the application, sets up event listeners and renders the initial dice state
function init() {
    document.addEventListener("touchstart", function () { }, false);
    renderDice(); // Render the dice based on initial settings

    // Set up event listeners for menu button, slider, and sides selector
    menuButton.addEventListener("click", toggleSidebar, false);
    slider.addEventListener("input", setOptions, false);
    sides.addEventListener("change", setOptions, false);

    // Set up event listeners for each dice face
    diceFaces.forEach(function (face) {
        if (isTouchDevice) {
            face.addEventListener("touchstart", lockDice, false); // Start lock on long press (mobile)
            face.addEventListener("touchend", cancelLongPress, false); // Cancel lock on touchend (mobile)
            face.addEventListener("touchcancel", cancelLongPress, false); // Cancel lock if touch event is interrupted
        }
        else {
            face.addEventListener("mousedown", lockDice, false); // Detect long press on mousedown
            face.addEventListener("mouseup", cancelLongPress, false); // Cancel long press on mouseup
        }
        face.addEventListener("click", startShakeDice, false); // Start shake animation on click
        face.addEventListener("animationstart", startRoll, false); // Start rolling the die when the animation starts
        face.addEventListener("animationend", stopShakeDice, false); // Stop the shake animation when it ends
        // Prevent default context menu on right-click or long press
        face.addEventListener("contextmenu", function (ev) {
            ev.preventDefault(); // Disable context menu on right-click or long press
        }, false);
    });
}

init();

// Service Worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(function(error) {
            console.log('Service Worker registration failed:', error);
        });
    });
}
