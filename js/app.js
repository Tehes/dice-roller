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
let numberOfDice = getRndInteger(1, 6);
const menuButton = document.querySelector("#hamburger");
const sidebar = document.querySelector("nav");
const slider = document.querySelector("#slider");
slider.value = numberOfDice;
const sides = document.querySelector("select");
let maxSides = 6;
sides.value = maxSides;


/* --------------------------------------------------------------------------------------------------
functions
---------------------------------------------------------------------------------------------------*/
// Renders the dice faces based on the number of dice and the number of sides
function renderDice() {
    diceFaces.forEach(function(face) {
        face.empty(); // Clear the face element
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

// Starts the dice roll animation and calls renderPips after a delay
function startRoll(ev) {
    const die = ev.target || ev;
    window.setTimeout(renderPips.bind(null, die), 350);
}

// Starts the shake animation for the dice
function startShakeDice() {
    diceFaces.forEach(function (face) {
        face.classList.add("animated");
    });
}

// Stops the shake animation for the dice
function stopShakeDice() {
    diceFaces.forEach(function (face) {
        face.classList.remove("animated");
    });
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

// Initializes the application, setting up event listeners and rendering the initial state of the dice
function init() {
    document.addEventListener("touchstart", function () { }, false);
    renderDice(); // Render the dice based on initial settings

    // Set up event listeners for menu button, slider, and sides selector
    menuButton.addEventListener("click", toggleSidebar, false);
    slider.addEventListener("input", setOptions, false);
    sides.addEventListener("change", setOptions, false);

    // Set up event listeners for each dice face
    diceFaces.forEach(function (face) {
        face.addEventListener("click", startShakeDice, false); // Start shake animation on click
        face.addEventListener("animationstart", startRoll, false); // Start rolling the die when the animation starts
        face.addEventListener("animationend", stopShakeDice, false); // Stop the shake animation when it ends
    });
}

init();
