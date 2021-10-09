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
		
		faces[x].classList.add("animated");
        randNum = getRndInteger(1,6);
        for (i = 0; i < randNum; i++) {
            pip = document.createElement("span");
            pip.classList.add("pip");
			faces[x].appendChild(pip);
        }
    }

    function rollDice(num) {
        var i;

        resetDice();
        for (i = 0; i < num; i++) {
            rollDie(i);
        }
    }

    function init() {
        document.addEventListener("touchstart", function() {}, false);
        rollDice(6); // no. of dice - max is 6

        for (var i = 0; i < faces.length; i++) {
            faces[i].addEventListener("click", rollDice.bind(this, 6), false);
			faces[i].addEventListener("animationend", function() { this.classList.remove("animated"); }, false);
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
