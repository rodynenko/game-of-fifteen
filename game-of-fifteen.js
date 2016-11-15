function puzzle15game(option){

	var elem = document.querySelector(option.elem),
			autoStart = option.autoStart || true,
			n = option.size || 4,
			self = this;
	if (!elem) throw Error("Element was not set");

	var width = (option.width || 400)+"px";

	var gameArray = [ ],
			gameArrayLength = n*n, // classical
			stepCounter = 0,
			emptyItemPos = n*n-1,
			directions = {
				"up": function(){ return emptyItemPos + n < n*n ? emptyItemPos + n : -1; },
				"down": function(){ return emptyItemPos - n > -1 ? emptyItemPos - n : -1; },
				"left": function(){ return (emptyItemPos % n !== 3) ? emptyItemPos + 1 : -1; },
				"rigth": function(){ return (emptyItemPos % n !== 0) ? emptyItemPos - 1 : -1; }
			},
			field;

/**
*
*
*@function this.newGame()
*/
	this.newGame = function(){
		gameArray.sort(function(){ return 0.5 - Math.random(); });
		stepCounter = 0;

		// remove puzzle items if exist
		field.innerHTML = "";

		// add rendom sorted puzzle items to field
		for (var i=0; i<gameArrayLength; i++){
			field.appendChild(gameArray[i]);
			if (gameArray[i].id == "puzzle-item"+(gameArrayLength-1)) emptyItemPos = i;
		}
	};

	/**
	*
	*
	*@function this.render
	*/
	this.render = function(){
		addClass(elem, "puzzle-game");
		elem.style.width = width;
		elem.tabIndex =  1;

		// create description text
		var description = document.createElement("span");
		description.className = "puzzle-description";
		if (!option.description) description.innerHTML = "Hi! It's 15 puzzle game. Rules are simple. Use arrows to move blocks";
		elem.appendChild(description);

		// create step field
		var stepField = document.createElement("div");
		stepField.className = "puzzle-score-field";
		stepField.innerHTML = "steps: 0";
		elem.appendChild(stepField);

		// add restart button
		var button = document.createElement("button");
		button.className = "puzzle-restart-button";
		button.innerHTML = "Restart";
		button.addEventListener("click", function(){
			self.newGame();
		});
		elem.appendChild(button);

		// create game field
		field = document.createElement("div");
		field.className = "puzzle-field";

		elem.appendChild(field);

		// add items to field
		for (var i=0; i<gameArrayLength; i++){
			var puzzleItem = document.createElement("div");
			puzzleItem.className = "puzzle-field-item";
			if (i == gameArrayLength - 1) { puzzleItem.className += " puzzle-field-empty-item"; } // emptyItem
			puzzleItem.id = "puzzle-item"+i;
			puzzleItem.innerHTML = i+1;
			gameArray.push(puzzleItem);
		}
		// set new game
		newGame();

		// add mouse click Listener

		field.addEventListener("click", function(e){
			var ev = e || event,
					targetElement = ev.target || ev.srcElement;

			if (targetElement.className.indexOf("puzzle-field-item") == -1) return;
			// if empty puzzle item - exit;
			if (targetElement.className.indexOf("puzzle-field-empty-item") > -1) return;

			//find direction
			targetPosInList = [].indexOf.call(field.querySelectorAll(".puzzle-field-item"),targetElement);

			if (targetPosInList > -1){
				// if puzzle is complete - do nothing
				if (puzzleIsComplete()) return;

				switch (targetPosInList){
					case emptyItemPos+1:
						movePuzzleItems("left");
						break;
					case emptyItemPos+n:
						movePuzzleItems("up");
						break;
					case emptyItemPos-1:
						movePuzzleItems("rigth");
						break;
					case emptyItemPos-n:
						movePuzzleItems("down");
						break;
					default:
						return;
				}

				if (puzzleIsComplete()) {
					alert("Congratulations! You have done it!");
					var restart = comfirm("Play again?");
					if (restart) this.newGame();
				}
			}

		});

		// add arrows click Listener
		document.body.addEventListener("keyup", function(e){
			var ev = e || window.event;

			// if puzzle is complete - do nothing
			if (puzzleIsComplete()) return;

			switch(ev.keyCode){
				case 37:
					movePuzzleItems("left");
					break;
				case 38:
					movePuzzleItems("up");
					break;
				case 39:
					movePuzzleItems("rigth");
					break;
				case 40:
					movePuzzleItems("down");
					break;
				default:
					return;
			}

			if (puzzleIsComplete()) {
				alert("Congratulations! You have done it!");
				var restart = comfirm("Play again?");
				if (restart) this.newGame();
			}
		});

	};

/**
*
*
*/
	function movePuzzleItems(direction){
		var itemToMove = directions[direction](),
				allItems = field.querySelectorAll(".puzzle-field-item");
		if (itemToMove > -1){
			var emptyNextSibling = direction == "left" ? allItems[emptyItemPos] : allItems[emptyItemPos].nextSibling,
				item = field.replaceChild(allItems[emptyItemPos], allItems[itemToMove]);
			field.insertBefore(item, emptyNextSibling);
			emptyItemPos = itemToMove; // change emptyItemPos
			// increase counter
			elem.querySelector(".puzzle-score-field").innerHTML = "steps: "+(++stepCounter);
		}
	}
/**
*
*/
	function puzzleIsComplete(){
		for (var i=0; i<field.childNodes.length; i++){
			if (field.childNodes[i].id != "puzzle-item"+i) return false;
		}
		return true;
	}



/**
*
*@function addClass
*@param {Element} el -
*@param {String} classString -
*/
	function addClass(el, classString){
		if(document.classList){
			el.classList.add(classString);
		}else{ // IE 11-
			if (el.className){
				el.className = classString;
			}else{
				el.className += " "+classString;
			}
		}
	}

	if (autoStart) this.render();

}
