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
    var slider = document.querySelector("#slider");
    slider.value = noOfDice;
	var sides = document.querySelector("select");
	var maxSides = 6;
	sides.value = maxSides;


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
        var i, randNum, pip, digit;

        randNum = getRndInteger(1,maxSides);
		
		if (maxSides === 6) {
			for (i = 0; i < randNum; i++) {
            pip = document.createElement("span");
            pip.classList.add("pip");
			faces[x].appendChild(pip);
            faces[x].classList.remove("animated");
        	}
		}
		else {
			digit = document.createElement("span");
            digit.classList.add("digit");
			digit.textContent = randNum;
			faces[x].appendChild(digit);
            faces[x].classList.remove("animated");
		}
    }

    function rollDice() {
        var i;

        resetDice();
        for (i = 0; i < noOfDice; i++) {
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

    function setOptions() {
        noOfDice = slider.value;
		maxSides = parseInt(sides.value);
        rollDice();
    }

    function init() {
        document.addEventListener("touchstart", function() {}, false);
        rollDice(noOfDice); // no. of dice - max is 6

        hamburgerIcon.addEventListener("click", toggleNav, false);
        slider.addEventListener("input", setOptions, false);	
		sides.addEventListener("change", setOptions, false);

        for (var i = 0; i < faces.length; i++) {
            faces[i].addEventListener("click", shakeDice, false);
			faces[i].addEventListener("animationend", rollDice, false);
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
