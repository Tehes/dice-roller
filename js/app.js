import { initServiceWorker } from "./service-worker-registration.js";

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
let previousNumberOfDice = numberOfDice;
let activeMode = "";
const diceContainer = document.querySelector("#dices");
const menuButton = document.querySelector("#hamburger");
const sidebar = document.querySelector("nav");
const slider = document.querySelector("#slider");
slider.value = numberOfDice;
const sides = document.querySelector("select");
let maxSides = 6; // Default number of sides is 6
sides.value = maxSides;
let pressTimer; // Timer to detect long press
let pressStartTime; // Variable to store the start time of mousedown
const standardResult = document.querySelector("#standardResult"); // Element that shows the sum of standard dice
const modeResults = document.querySelectorAll(".mode-results");
const tokyoResults = document.querySelector("#tokyoResults");
const tokyoPoints = document.querySelector("#tokyoPoints");
const tokyoHearts = document.querySelector("#tokyoHearts");
const tokyoEnergy = document.querySelector("#tokyoEnergy");
const tokyoPaws = document.querySelector("#tokyoPaws");
const diceModes = {
    tokyo: {
        defaultDice: 6,
        faces: ["1", "2", "3", "favorite", "bolt", "pets"],
        summary: tokyoResults,
        renderFace: renderTokyoFace,
        updateSummary: updateTokyoSummary,
    },
};
const longPressThreshold = 500; // Threshold to define long press
// Detect if the device supports touch inputs
// 'ontouchstart' checks for touch events, and maxTouchPoints checks for the number of touch points
const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints;

const USE_SERVICE_WORKER = true;
const SERVICE_WORKER_VERSION = "2026-09-28-v2";
const AUTO_RELOAD_ON_SW_UPDATE = true; // reload page once after an update

/* --------------------------------------------------------------------------------------------------
functions
---------------------------------------------------------------------------------------------------*/
function updateTokyoSummary() {
    const counts = { 1: 0, 2: 0, 3: 0, favorite: 0, bolt: 0, pets: 0 };
    diceFaces.forEach((face) => {
        if (face.dataset.value !== undefined) {
            counts[face.dataset.value]++;
        }
    });

    let points = 0;
    for (let value = 1; value <= 3; value++) {
        if (counts[value] >= 3) {
            points += value + counts[value] - 3;
        }
    }

    tokyoPoints.textContent = points;
    tokyoHearts.textContent = counts.favorite;
    tokyoEnergy.textContent = counts.bolt;
    tokyoPaws.textContent = counts.pets;
}

// Updates the result display for the selected dice type
function computeTotal() {
    const mode = diceModes[sides.value];
    standardResult.hidden = Boolean(mode);
    modeResults.forEach((results) => {
        results.hidden = !mode || results !== mode.summary;
    });
    if (mode) {
        mode.updateSummary();
        return;
    }

    let sum = 0;
    diceFaces.forEach(function (face) {
        const value = parseInt(face.dataset.value);
        if (!isNaN(value)) {
            sum += value;
        }
    });
    standardResult.textContent = sum;
}

// Clears and renders dice faces based on the number of dice and the number of sides
function renderDice() {
    // Clear all dice faces and remove any previously stored values
    diceFaces.forEach(function (face) {
        face.empty();                   // Remove children
        delete face.dataset.value;      // Remove old rolled value
    });

    // Render the required number of dice
    for (let i = 0; i < numberOfDice; i++) {
        renderPips(diceFaces[i]);       // Add pips or digits and update totals
    }

    // Ensure the total is correct in case numberOfDice was reduced to 0
    computeTotal();
}

async function loadSymbolFont() {
    try {
        const fonts = await document.fonts.load("400 24px \"Material Symbols Outlined\"");
        if (fonts.length === 0) {
            throw new Error("Material Symbols Outlined is not available.");
        }
        document.documentElement.classList.add("symbols-ready");
    } catch (error) {
        console.warn("Symbol font could not be loaded:", error);
    }
}

function renderTokyoFace(die, value) {
    const result = document.createElement("span");
    const isNumber = value === "1" || value === "2" || value === "3";
    result.classList.add(isNumber ? "digit" : "material-symbols-outlined");
    if (!isNumber) {
        result.classList.add("symbol");
    }
    result.textContent = value;
    die.appendChild(result);
}

// Generates and renders the pips (or digit) for a die
function renderPips(die) {
    die.empty(); // Clear the face element
    const mode = diceModes[sides.value];
    const randNum = getRndInteger(1, maxSides);
    die.dataset.value = mode ? mode.faces[randNum - 1] : randNum;

    if (mode) {
        mode.renderFace(die, die.dataset.value);
    } else if (maxSides === 6) {
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
    computeTotal(); // Update the total after this die has been rolled
}

// Rolls the dice after a short delay and renders the new pips
function startRoll(ev) {
    const die = ev.currentTarget || ev;
    globalThis.setTimeout(renderPips.bind(null, die), 350);
}

// Starts the shake animation for the dice
function startShakeDice() {
    const pressDuration = Date.now() - pressStartTime;

    // Only trigger dice roll if the press was short
    if (pressDuration < longPressThreshold) {
        const delays = [40, 80, 120, 160, 200, 240];
        for (let i = delays.length - 1; i > 0; i--) {
            const j = getRndInteger(0, i);
            [delays[i], delays[j]] = [delays[j], delays[i]];
        }

        diceFaces.forEach(function (face, index) {
            if (index < numberOfDice && !face.classList.contains("locked") && !face.classList.contains("animated")) {
                face.style.setProperty("--shake-delay", `${delays[index]}ms`);
                face.classList.add("animated");
            }
        });
    }
}

// Stops the shake animation for the dice
function stopShakeDice(ev) {
    ev.currentTarget.classList.remove("animated");
}

// Locks/unlocks dice on long press
function lockDice(ev) {
    const die = ev.currentTarget;

    pressStartTime = Date.now(); // Record the time when mousedown starts

    pressTimer = globalThis.setTimeout(function () {
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
    const modeKey = diceModes[sides.value] ? sides.value : "";
    const mode = diceModes[modeKey];
    const modeChanged = activeMode !== modeKey;
    if (modeChanged) {
        if (!activeMode && mode) {
            previousNumberOfDice = Number(slider.value);
        }
        slider.value = mode ? mode.defaultDice : previousNumberOfDice;
        if (activeMode) {
            diceContainer.classList.remove(activeMode);
        }
        if (modeKey) {
            diceContainer.classList.add(modeKey);
        }
        activeMode = modeKey;
        diceFaces.forEach((face) => face.classList.remove("locked"));
    }
    numberOfDice = Number(slider.value);
    maxSides = mode ? mode.faces.length : Number(sides.value);
    renderDice();
}

// Initializes the application, sets up event listeners and renders the initial dice state
function init() {
    loadSymbolFont();
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

    initServiceWorker({
        useServiceWorker: USE_SERVICE_WORKER,
        serviceWorkerVersion: SERVICE_WORKER_VERSION,
        autoReloadOnSwUpdate: AUTO_RELOAD_ON_SW_UPDATE,
    });
}

/* --------------------------------------------------------------------------------------------------
public members, exposed with return statement
---------------------------------------------------------------------------------------------------*/
globalThis.app = {
	init,
};

globalThis.app.init();
