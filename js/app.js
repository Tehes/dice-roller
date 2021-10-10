var app = (function() {
    /* -------------------- Helper functions -------------------- */

    HTMLElement.prototype.empty = function() {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
    };

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /* --------------------------------------------------------------------------------------------------
    Variables
    ---------------------------------------------------------------------------------------------------*/
    var faces = document.querySelectorAll(".face");
    var noOfDice = getRndInteger(1,6);
    var hamburgerIcon = document.querySelector("#hamburger");
    var sidebar = document.querySelector("nav");


    /* --------------------------------------------------------------------------------------------------
    functions
    ---------------------------------------------------------------------------------------------------*/
    function resetDice() {
    var i;

    for (i = 0; i < faces.length; i++) {
            faces[i].empty();
        }
    }

    function rollDie(x) {
        var i, randNum;

        randNum = getRndInteger(1,6);
        for (i = 0; i < randNum; i++) {
            pip = document.createElement("span");
            pip.classList.add("pip");
			faces[x].appendChild(pip);
            faces[x].classList.remove("animated");
        }
    }

    function rollDice(num) {
        var i;

        resetDice();
        for (i = 0; i < num; i++) {
            rollDie(i);
        }
    }

    function shakeDice() {
        for (var i = 0; i < faces.length; i++) {
            faces[i].classList.add("animated");
        }
    }

    /* Set the width of the side navigation to 250px */
    function toggleNav() {
        sidebar.classList.toggle("open");
    }

    function init() {
        document.addEventListener("touchstart", function() {}, false);
        rollDice(noOfDice); // no. of dice - max is 6

        hamburgerIcon.addEventListener("click", toggleNav, false);
        for (var i = 0; i < faces.length; i++) {
            faces[i].addEventListener("click", shakeDice, false);
			faces[i].addEventListener("animationend", rollDice.bind(this, noOfDice), false);
        }
    }

    /* --------------------------------------------------------------------------------------------------
    public members, exposed with return statement
    ---------------------------------------------------------------------------------------------------*/
    return {
        init: init
    };

})();

app.init();
