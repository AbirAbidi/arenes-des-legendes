document.addEventListener('DOMContentLoaded', function() { // Attendre que le DOM soit complètement chargé


    class Player {
        constructor(name, image) {
            this.name = name;
            this.image = image;
            this.position = null;
        }

        setPosition(position) {
            this.position = position;
        }

        getPosition() {
            return this.position;
        }

        move(direction) {
            let newPosition = this.position;

            switch(direction) {
                case 'up':
                    if (this.position >= TAILLE) {
                        newPosition = this.position - TAILLE;
                    }
                    break;
                case 'down':
                    if (this.position < TOTAL_CASES - TAILLE) {
                        newPosition = this.position + TAILLE;
                    }
                    break;
                case 'left':
                    if (this.position % TAILLE !== 0) {
                        newPosition = this.position - 1;
                    }
                    break;
                case 'right':
                    if ((this.position + 1) % TAILLE !== 0) {
                        newPosition = this.position + 1;
                    }
                    break;
            }

            this.setPosition(newPosition);
        }
    }

    class Guerrier extends Player {
        constructor() {
            super('guerrier', '/assets/characters/guerrier.png');
        }
    }

    class Archer extends Player {
        constructor() {
            super('archer', '/assets/characters/archer.png');
        }
    }

    class Mage extends Player {
        constructor() {
            super('Mage', '/assets/characters/mage.png');
        }
    }



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
        document.getElementById("arene").classList.add('visible');
        this.style.display = 'none';
    });


    // -------------------------------- DEBUT DICE ---------------------------------------------------//
    //ki u click dice is being rolled to give a random nbr
    const dice = document.getElementById('dice');
    dice.addEventListener('click', function() {
        dice.textContent =  Math.floor(Math.random() * 6) + 1;
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
                if (selection.nom === 'guerrier') {
                    player = new Guerrier();
                } else if (selection.nom === 'archer') {
                    player = new Archer();
                } else if (selection.nom === 'mage') {
                    player = new Mage();
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
            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
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
            currentPlayer.move(direction);

            // Check if player moved to a valid position
            const newPosition = currentPlayer.getPosition();

            // Check if there's an obstacle
            const newCase = cases.find(c => c.id === newPosition);
            if (newCase && newCase.element.classList.contains('obstacle')) {
                // If there's an obstacle, revert the move
                currentPlayer.setPosition(oldPosition);
                alert("Vous ne pouvez pas aller ici - obstacle!");
            } else {
                // Update player position on the grid
                updatePlayerPosition(currentPlayer, oldPosition);

                // Check for special case effects
                checkCaseEffect(newPosition);

                // Switch to next player's turn
                nextTurn();
            }
        }
    }

    // Function to check for special case effects
    function checkCaseEffect(position) {
        const caseInfo = cases.find(c => c.id === position);
        if (!caseInfo) return;

        // Check for bonuses
        if (caseInfo.element.classList.contains('bonus')) {
            alert("Bonus! Vous pouvez rejouer.");
            // Don't switch to next player (implemented by skipping nextTurn() call)
        }

        // Check for traps
        if (caseInfo.element.classList.contains('piege')) {
            alert("Piège! Vous perdez votre prochain tour.");
            // Skip player's next turn (could be implemented with a flag)
            nextTurn(); // Skip to next player immediately
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