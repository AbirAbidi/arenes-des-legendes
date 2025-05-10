document.addEventListener('DOMContentLoaded', function() { // Attendre que le DOM soit complètement chargé

    let playerDiceRolls = [];
    let playerOrder = [];
    let currentRollingPlayer = 0;
    let allPlayersRolled = false;

    // -------------------------------- DEBUT CLASSES ---------------------------------------------------//
    class Player {
        constructor(name, image) {
            this.name = name;
            this.image = image;
            this.position = null;
            this.diceRoll = null ;
            this.lastMoveValid = true ; // why this ? cuz in case i do a move and its beyond border so it wont skip the player turn and chnages only if he does make a move
        }

        setPosition(position) {
            this.position = position;
        }

        getPosition() {
            return this.position;
        }

        move(direction) {
            let newPosition = this.position;
            this.lastMoveValid = true;

            switch(direction) {
                case 'up':
                    if (this.position >= TAILLE) {
                        newPosition = this.position - TAILLE;
                    }else {
                        this.lastMoveValid = false;
                    }
                    break;
                case 'down':
                    if (this.position < TOTAL_CASES - TAILLE) {
                        newPosition = this.position + TAILLE;
                    }else {
                        this.lastMoveValid = false;
                    }
                    break;
                case 'left':
                    if (this.position % TAILLE !== 0) {
                        newPosition = this.position - 1;
                    }else {
                        this.lastMoveValid = false;
                    }
                    break;
                case 'right':
                    if ((this.position + 1) % TAILLE !== 0) {
                        newPosition = this.position + 1;
                    }else {
                        this.lastMoveValid = false;
                    }
                    break;
            }

            if (this.lastMoveValid) {
                this.setPosition(newPosition);
            }

            return this.lastMoveValid;
        }
    }

    class Chevalier extends Player {
        constructor() {
            super('chevalier', '/assets/characters/Chevalier.png');
        }
    }

    class Ninja extends Player {
        constructor() {
            super('ninja', '/assets/characters/Ninja.png');
        }

        move(direction) {
            let newPosition = this.position;
            this.lastMoveValid = true;

            const currentRow = Math.floor(this.position / TAILLE);
            const currentCol = this.position % TAILLE;

            switch(direction) {
                case 'up':
                    if (currentRow >= 2) {
                        newPosition = this.position - 2 * TAILLE;
                    } else {
                        this.lastMoveValid = false;
                    }
                    break;
                case 'down':
                    if (currentRow <= (Math.floor(TOTAL_CASES / TAILLE) - 3)) {
                        newPosition = this.position + 2 * TAILLE;
                    } else {
                        this.lastMoveValid = false;
                    }
                    break;
                case 'left':
                    if (currentCol >= 2) {
                        newPosition = this.position - 2;
                    } else {
                        this.lastMoveValid = false;
                    }
                    break;
                case 'right':
                    if (currentCol <= (TAILLE - 3)) {
                        newPosition = this.position + 2;
                    } else {
                        this.lastMoveValid = false;
                    }
                    break;
            }

            if (this.lastMoveValid) {
                this.setPosition(newPosition);
            }

            return this.lastMoveValid;
        }
    }

    class Sorcier extends Player {
        constructor() {
            super('sorcier', '/assets/characters/Sorcier.png');
        }
    }
    // -------------------------------- FIN CLASSES ---------------------------------------------------//



    // -------------------------------- DEBUT CREATION ARENE ET CASES ---------------------------------------------------//
    function positionAleatoire() {
        let pos;
        const cornerPositions = [TOP_LEFT_CORNER, TOP_RIGHT_CORNER, BOTTOM_LEFT_CORNER, BOTTOM_RIGHT_CORNER];

        do {
            pos = Math.floor(Math.random() * TOTAL_CASES);
        } while (positionsUtilisées.has(pos) || cornerPositions.includes(pos)); //abir here u might be wondring wtf but dw u smart cuz u just excludes the 4 corners so the obsacles and the other shit wont appear there and create conflict
        positionsUtilisées.add(pos);
        return pos;
    }

    function creerArene() {
        const arene = document.getElementById('arene');
        arene.style.gridTemplateColumns = `repeat(${TAILLE}, 1fr)`;

        // Création des cases
        for (let i = 0; i < TOTAL_CASES; i++) {
            const caseDiv = document.createElement('div');
            caseDiv.classList.add('case');
            caseDiv.id = `case-${i}`;

            const decor = document.createElement('div');
            decor.classList.add('decor');

            const element = document.createElement('div');
            element.classList.add('element');

            caseDiv.appendChild(decor);
            caseDiv.appendChild(element);
            arene.appendChild(caseDiv);

            cases.push({ div: caseDiv, element, id: i });
        }

        // Obstacles visibles
        for (let i = 0; i < NB_OBSTACLES; i++) {
            const index = positionAleatoire();
            cases[index].element.classList.add('obstacle');
        }

        // Bonus visibles
        for (let i = 0; i < NB_BONUS; i++) {
            const index = positionAleatoire();
            cases[index].element.classList.add('bonus');
        }

        // Pièges visibles
        for (let i = 0; i < NB_PIEGES; i++) {
            const index = positionAleatoire();
            cases[index].element.classList.add('piege');
        }

        // Surprises cachées
        for (let i = 0; i < NB_SURPRISES; i++) {
            const index = positionAleatoire();
            const type = Math.random() < 0.5 ? 'bonus' : 'piege';
            cases[index].element.dataset.surprise = type;
            cases[index].element.innerText = "?";
        }

        return arene;
    }

    const arene = creerArene();
    // -------------------------------- FIN CREATION ARENE ET CASES ---------------------------------------------------//





    // ki u click depart ti5tafi
    document.getElementById("depart").addEventListener("click", function () {
        document.getElementById("dice-container").style.display = "flex";
        this.style.display = 'none';
    });


    // -------------------------------- DEBUT DICE ---------------------------------------------------//
    //ki u click dice is being rolled to give a random nbr
    const dice = document.getElementById('dice');
    const diceResults = document.getElementById('dice-results');
    const playerTurnIndicator = document.getElementById('player-turn-indicator');
    const startGameBtn = document.getElementById('start-game-btn');
    dice.addEventListener('click', function() {
        if (allPlayersRolled) return;

        const randomNumber = Math.floor(Math.random() * 6) + 1;
        dice.textContent = randomNumber;

        const currentPlayer = players[currentRollingPlayer];
        currentPlayer.diceRoll = randomNumber;

        // Add result to the results display
        const resultItem = document.createElement('div');
        resultItem.classList.add('dice-result-item');
        resultItem.textContent = `Joueur ${currentRollingPlayer + 1} (${currentPlayer.name}): ${randomNumber}`;
        diceResults.appendChild(resultItem);

        // Move to next player or finish rolling phase
        currentRollingPlayer++;

        if (currentRollingPlayer < players.length) {
            playerTurnIndicator.textContent = `Joueur ${currentRollingPlayer + 1}, lancez le dé`;
        } else {
            allPlayersRolled = true;
            playerTurnIndicator.textContent = `Tous les joueurs ont lancé le dé!`;

            // Determine playing order based on dice rolls (highest first)
            determinePlayingOrder();

            // Show start button
            startGameBtn.style.display = 'block';
        }
    });


    function determinePlayingOrder() {
        // Create array with player indices and their rolls
        const playersWithRolls = players.map((player, index) => ({
            playerIndex: index,
            roll: player.diceRoll
        }));


        // Sort by roll value (descending)
        playersWithRolls.sort((a, b) => b.roll - a.roll);

        // Extract the order
        playerOrder = playersWithRolls.map(p => p.playerIndex);

        // Show the order in the results
        const orderResult = document.createElement('div');
        orderResult.classList.add('dice-result-item');
        orderResult.style.fontWeight = 'bold';
        orderResult.style.marginTop = '10px';

        let orderText = "Ordre de jeu: ";
        playerOrder.forEach((playerIndex, orderIndex) => {
            orderText += `${orderIndex + 1}. Joueur ${playerIndex + 1}`;
            if (orderIndex < playerOrder.length - 1) {
                orderText += ", ";
            }
        });

        orderResult.textContent = orderText;
        diceResults.appendChild(orderResult);
    }

    startGameBtn.addEventListener('click', function() {
        // Set the first player based on dice roll results
        currentPlayerIndex = playerOrder[0];

        document.getElementById('dice-container').style.display = 'none';

        document.getElementById('arene').style.display = 'grid';

        updateTurnDisplay();
    });
    // -------------------------------- FIN DICE ---------------------------------------------------//




    // -------------------------------- DEBUT BRING CHARACTER LOCAL STORAGE ---------------------------------------------------//
    // to get the array that has the player's characters
    function placePlayersInCorners() {
        const cornerPositions = [TOP_LEFT_CORNER, TOP_RIGHT_CORNER, BOTTOM_LEFT_CORNER, BOTTOM_RIGHT_CORNER];

        players.forEach((player, index) => {
            if (index < cornerPositions.length) {
                const cornerPosition = cornerPositions[index];
                player.setPosition(cornerPosition);

                const caseDiv = document.querySelector(`#case-${cornerPosition}`);
                const img = document.createElement("img");
                img.src = player.image;
                img.alt = player.name;
                img.classList.add('image');

                const playerNumberDiv = document.createElement("div");
                playerNumberDiv.textContent = `Joueur ${index + 1}`;
                playerNumberDiv.classList.add('player-number');

                caseDiv.appendChild(playerNumberDiv);
                caseDiv.appendChild(img);

                console.log(`Player ${index + 1} (${player.name}) placed at position ${cornerPosition}`);
            }
        });
    }

    const players = [];
    const playerSelectionsData = localStorage.getItem('playerSelections');

    if (playerSelectionsData) {
        const playerSelections = JSON.parse(playerSelectionsData);

        if (playerSelections && playerSelections.length > 0) {
            console.log('Player selections:', playerSelections);

            playerSelections.forEach(selection => {
                let player;
                if (selection.nom === 'Chevalier') {
                    player = new Chevalier();
                } else if (selection.nom === 'Ninja') {
                    player = new Ninja();
                } else if (selection.nom === 'Sorcier') {
                    player = new Sorcier();
                }

                if (player) {
                    players.push(player);
                }
            });
        } else {
        console.error('No player selections found in localStorage.');
    }}
    // -------------------------------- FIN BRING CHARACTER LOCAL STORAGE ---------------------------------------------------//





    // -------------------------------- DEBUT WHO'S turn is now ? ---------------------------------------------------//
    let currentPlayerIndex = 0;
    const turnDisplay = document.getElementById('turn-display');

    function updateTurnDisplay() {
        if (players.length > 0) {
            turnDisplay.textContent = `Tour de: Joueur ${currentPlayerIndex + 1} (${players[currentPlayerIndex].name})`;
        } else {
            turnDisplay.textContent = "Aucun joueur disponible";
        }
    }

    function updatePlayerPosition(player, oldPosition) {
        // Remove player from previous position
        if (oldPosition !== undefined) {
            const oldCaseDiv = document.querySelector(`#case-${oldPosition}`);
            if (oldCaseDiv) {
                const oldPlayerImg = oldCaseDiv.querySelector('img');
                const oldPlayerNbr = oldCaseDiv.querySelector('.player-number');
                if (oldPlayerImg) {
                    oldCaseDiv.removeChild(oldPlayerImg);
                }
                if (oldPlayerNbr) {
                    oldCaseDiv.removeChild(oldPlayerNbr);
                }
            }
        }

        // Add player to new position
        const newCaseDiv = document.querySelector(`#case-${player.getPosition()}`);
        if (newCaseDiv) {
            const img = document.createElement("img");
            img.src = player.image;
            img.alt = player.name;
            img.classList.add('image');

            const playerNumberDiv = document.createElement("div");
            const playerIndex = players.findIndex(p => p === player);
            playerNumberDiv.textContent = `Joueur ${playerIndex + 1}`;
            playerNumberDiv.classList.add('player-number');

            newCaseDiv.appendChild(playerNumberDiv);
            newCaseDiv.appendChild(img);
        }
    }

    // Function to switch to the next player's turn
    function nextTurn() {
        if (players.length > 0) {
            // Use the player order determined by dice rolls
            const currentOrderIndex = playerOrder.indexOf(currentPlayerIndex);
            const nextOrderIndex = (currentOrderIndex + 1) % playerOrder.length;
            currentPlayerIndex = playerOrder[nextOrderIndex];

            updateTurnDisplay();
        }
    }
    // Function to handle key presses for movement
    function handleMovement(event) {
        if (players.length === 0) return;

        const currentPlayer = players[currentPlayerIndex];
        let direction = '';

        // Determine direction based on key press
        if (event.key === 'ArrowUp') {
            direction = 'up';
        } else if (event.key === 'ArrowDown') {
            direction = 'down';
        } else if (event.key === 'ArrowLeft') {
            direction = 'left';
        } else if (event.key === 'ArrowRight') {
            direction = 'right';
        }

        if (direction) {
            const oldPosition = currentPlayer.getPosition();
            const moveResult = currentPlayer.move(direction);
            if (!moveResult) {
                alert("Vous ne pouvez pas vous déplacer dans cette direction - limite du plateau!");
                return; // Garder le tour du joueur actuel
            }
            // Check if player moved to a valid position
            const newPosition = currentPlayer.getPosition();
            const newCase = cases.find(c => c.id === newPosition);
            if (newCase && newCase.element.classList.contains('obstacle')) {
                currentPlayer.setPosition(oldPosition);
                alert("Vous ne pouvez pas aller ici - obstacle!");
                return;
            }
                updatePlayerPosition(currentPlayer, oldPosition);
                const skipNextTurn = checkCaseEffect(newPosition);
                if (!skipNextTurn) {
                    nextTurn();
                }

        }
    }


    // Function to check for special case effects
    function checkCaseEffect(position) {
        const caseInfo = cases.find(c => c.id === position);
        if (!caseInfo) return false;
        let keepTurn = false;
        // Check for bonuses
        if (caseInfo.element.classList.contains('bonus')) {
            alert("Bonus! Vous pouvez rejouer.");
            keepTurn = true;
        }

        // Check for traps
        if (caseInfo.element.classList.contains('piege')) {
            alert("Piège! Vous perdez votre prochain tour.");
            // Skip player's next turn (could be implemented with a flag)
            nextTurn(); // Skip to next player immediately
            keepTurn = true;
        }

        // Check for surprises
        if (caseInfo.element.dataset.surprise) {
            const surpriseType = caseInfo.element.dataset.surprise;
            if (surpriseType === 'bonus') {
                alert("Surprise positive! Vous avancez de 2 cases.");
                // Implement bonus effect
            } else if (surpriseType === 'piege') {
                alert("Surprise négative! Vous reculez de 2 cases.");
                // Implement trap effect
            }

            // Remove the surprise after it's triggered
            delete caseInfo.element.dataset.surprise;
            caseInfo.element.innerText = "";
        }
        return keepTurn;
    }

    // Initialize the game
    function initGame() {
        console.log('Initializing game with', players.length, 'players');
        if (players.length > 0) {
            placePlayersInCorners();
            updateTurnDisplay();
        } else {
            console.error('No players available to initialize game');
        }

        // Listen for arrow key press events to move the character
        document.addEventListener('keydown', handleMovement);
    }

    // Start the game when everything is loaded
    initGame();
    // -------------------------------- FIN WHO'S turn is now ? ---------------------------------------------------//





});