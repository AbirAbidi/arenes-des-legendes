document.addEventListener('DOMContentLoaded', function() { // Attendre que le DOM soit complètement chargé

    let playerOrder = [];
    let currentRollingPlayer = 0;
    let allPlayersRolled = false;
    const dice = document.getElementById('dice');
    const diceResults = document.getElementById('dice-results');
    const playerTurnIndicator = document.getElementById('player-turn-indicator');
    const startGameBtn = document.getElementById('start-game-btn');
    const players = [];
    const playerSelectionsData = localStorage.getItem('playerSelections');
    let currentPlayerIndex = 0;
    const turnDisplay = document.getElementById('turn-display');
    let currentAction  = null ; //est ce que se deplacer , attaquer ...
    let actionButtonsEnabled = false;


    // -------------------------------- DEBUT CLASSES ---------------------------------------------------//
    class Player {
        constructor(name, image) {
            this.name = name;
            this.image = image;
            this.position = null;
            this.diceRoll = null ;
            this.lastMoveValid = true ; // why this ? cuz in case i do a move and its beyond border so it wont skip the player turn and chnages only if he does make a move
            this.health = INITIAL_HEALTH ;
            this.isDefending = false ;
        }

        setPosition(position) {
            this.position = position;
        }

        getPosition() {
            return this.position;
        }

        //TODO : update this so ninja can move and attack too
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

//TODO update attack so sorcier can attack even 2-3 cases far
        //TODO : add a dice for attacks cuz not always it works 1-2 fails / 3-5 reussite degats normaux / 6 copu critique ( update the random)
        attack(attackType) {
            const adjacentPositions = this.getAdjacentPositions();
            const targets = players.filter(p => p !== this && adjacentPositions.includes(p.position));

            if (targets.length === 0) {
                alert("Aucun adversaire à proximité!");
                return false;
            }

            // Simple implementation: attack the first target found
            const target = targets[0];
            const targetIndex = players.findIndex(p => p === target);

            // Damage calculation based on attack type
            let damage, attackMessage;

            if (attackType === 'rapid') {
                damage = Math.floor(Math.random() * 8) + 8; // Random damage between 8-15
                attackMessage = `${this.name} effectue une attaque rapide sur ${target.name}`;
            } else if (attackType === 'heavy') {
                damage = Math.floor(Math.random() * 12) + 15; // Random damage between 15-26
                attackMessage = `${this.name} effectue une attaque lourde sur ${target.name}`;
            } else {
                // Default attack for backward compatibility
                damage = Math.floor(Math.random() * 10) + 10; // Random damage between 10-19
                attackMessage = `${this.name} attaque ${target.name}`;
            }

            // Apply defense reduction if target is defending
            let finalDamage = damage;
            if (target.isDefending) {
                finalDamage = Math.floor(damage / 2);
                target.isDefending = false; // Defense is consumed
                attackMessage += ` (défense réduit les dégâts de moitié)`;
            }

            target.health = Math.max(0, target.health - finalDamage);
            applyDamageEffect(targetIndex);

            alert(`${attackMessage} pour ${finalDamage} points de dégâts!`);
            updateHealthBars();

            return true;
        }

        specialPower(player) {
            // TODO : terminer les pouvoirs special des charcaters ( creer les 3 fcts )
            // ti mahou ma yajim y3awid yista3mlha keni ba3d 3 fois
            if (player.disponibilite > 0) {
                alert(`Pouvoir spécial indisponible. Recharge : ${player.disponibilite} tour(s) restant(s).`);
                return false;
            }

            switch (player.type) {
                case 'chevalier':
                    // Pouvoir : Coup de guerre (dégâts sur un ennemi proche)
                    alert('Chevalier utilise Coup de guerre !');
                    dealDamageToNearestEnemy(player, 30); //  30 dégâts
                    break;

                case 'ninja':
                    // Pouvoir : Double attaque (deux attaques rapides)
                    alert('Ninja utilise Double attaque !');
                    attackTwice(player);
                    break;

                case 'sorcier':
                    // Pouvoir : Tempête magique (zone d’effet autour du joueur)
                    alert('Sorcier utilise Tempête magique !');
                    magicStorm(player);
                    break;

            }

            // Après utilisation, lancer la recharge (3 tours)
            player.disponibilite = 3;
            return true;
        }

// TODO : defend function
        defend() {
            this.isDefending = true;
            alert(`${this.name} se prépare à défendre!`);
            return true;
        }

        // TODO : finish the dodge too ( idk how tf m gonna to i dont get it)
        dodge() {
            const dodgeSuccess = Math.random() > 0.5; // 50% chance
            if (dodgeSuccess) {
                alert(`${this.name} a réussi son esquive!`);
                // Implement dodge effect (eg. move to random adjacent cell)
                const adjacentPositions = this.getAdjacentPositions();
                const validPositions = adjacentPositions.filter(pos =>
                    pos >= 0 && pos < TOTAL_CASES &&
                    !cases[pos].element.classList.contains('obstacle')
                );

                if (validPositions.length > 0) {
                    const oldPosition = this.position;
                    this.setPosition(validPositions[Math.floor(Math.random() * validPositions.length)]);
                    updatePlayerPosition(this, oldPosition);
                }
            } else {
                alert(`${this.name} a échoué son esquive!`);
            }
            return true;
        }

        getAdjacentPositions() {
            return [
                this.position - TAILLE, // Up
                this.position + TAILLE, // Down
                this.position - 1, // Left
                this.position + 1  // Right
            ].filter(pos => pos >= 0 && pos < TOTAL_CASES); // Filter valid positions
        }
    }
    class Chevalier extends Player {
        constructor() {
            super('chevalier', '/assets/characters/Chevalier.png');
        }
        // Override specialPower for Chevalier
        specialPower() {
            alert("Le Chevalier utilise Frappe Héroïque!");
            // Inflict double damage to all adjacent enemies
            const adjacentPositions = this.getAdjacentPositions();
            const targets = players.filter(p => p !== this && adjacentPositions.includes(p.position));

            if (targets.length === 0) {
                alert("Aucun adversaire à proximité!");
                return true;
            }

            targets.forEach(target => {
                const damage = Math.floor(Math.random() * 15) + 15; // Random damage between 15-29
                target.health = Math.max(0, target.health - damage);
                alert(`Frappe Héroïque inflige ${damage} points de dégâts à ${target.name}!`);
            });

            updateHealthBars();
            return true;
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

        // Override specialPower for Ninja
        specialPower() {
            alert("Le Ninja utilise Attaque Furtive!");
            // Attack with 100% chance of critical hit
            const adjacentPositions = this.getAdjacentPositions();
            const targets = players.filter(p => p !== this && adjacentPositions.includes(p.position));

            if (targets.length === 0) {
                // If no adjacent targets, can attack any player
                const otherPlayers = players.filter(p => p !== this);
                if (otherPlayers.length === 0) return true;

                const target = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
                const damage = Math.floor(Math.random() * 20) + 20; // Random damage between 20-39
                target.health = Math.max(0, target.health - damage);
                alert(`Attaque Furtive inflige ${damage} points de dégâts à ${target.name} à distance!`);
            } else {
                const target = targets[Math.floor(Math.random() * targets.length)];
                const damage = Math.floor(Math.random() * 25) + 25; // Random damage between 25-49
                target.health = Math.max(0, target.health - damage);
                alert(`Attaque Furtive inflige ${damage} points de dégâts critiques à ${target.name}!`);
            }

            updateHealthBars();
            return true;
        }

        // Override dodge for Ninja (higher success rate)
        dodge() {
            const dodgeSuccess = Math.random() > 0.25; // 75% chance for Ninja
            if (dodgeSuccess) {
                alert(`${this.name} a réussi son esquive avec agilité!`);
                // Ninja can move to any empty cell within 3 spaces
                const oldPosition = this.position;

                // Get valid positions within 3 spaces
                const validPositions = [];
                const currentRow = Math.floor(this.position / TAILLE);
                const currentCol = this.position % TAILLE;

                for (let r = Math.max(0, currentRow - 3); r <= Math.min(TAILLE - 1, currentRow + 3); r++) {
                    for (let c = Math.max(0, currentCol - 3); c <= Math.min(TAILLE - 1, currentCol + 3); c++) {
                        const pos = r * TAILLE + c;
                        if (pos !== this.position && !cases[pos].element.classList.contains('obstacle')) {
                            validPositions.push(pos);
                        }
                    }
                }

                if (validPositions.length > 0) {
                    this.setPosition(validPositions[Math.floor(Math.random() * validPositions.length)]);
                    updatePlayerPosition(this, oldPosition);
                }
            } else {
                alert(`${this.name} a échoué son esquive!`);
            }
            return true;
        }
    }
    class Sorcier extends Player {
        constructor() {
            super('sorcier', '/assets/characters/Sorcier.png');
        }

        // Override specialPower for Sorcier
        specialPower() {
            alert("Le Sorcier lance Explosion Arcanique!");
            // Damage all opponents on the board
            const otherPlayers = players.filter(p => p !== this);

            if (otherPlayers.length === 0) return true;

            otherPlayers.forEach(target => {
                // Damage depends on distance: closer = more damage
                const distance = calculateDistance(this.position, target.position);
                const baseDamage = 30;
                const damage = Math.max(5, Math.floor(baseDamage / (distance + 1)));

                target.health = Math.max(0, target.health - damage);
                alert(`Explosion Arcanique inflige ${damage} points de dégâts à ${target.name}!`);
            });

            // Heal self for 10 points
            this.health = Math.min(INITIAL_HEALTH, this.health + 10);
            alert("Le Sorcier récupère 10 points de vie!");

            updateHealthBars();
            return true;
        }
    }
    // Helper function to calculate distance between positions
    function calculateDistance(pos1, pos2) {
        const row1 = Math.floor(pos1 / TAILLE);
        const col1 = pos1 % TAILLE;
        const row2 = Math.floor(pos2 / TAILLE);
        const col2 = pos2 % TAILLE;

        return Math.abs(row1 - row2) + Math.abs(col1 - col2);
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






    // -------------------------------- DEBUT DICE ---------------------------------------------------//
    // ki u click depart ti5tafi
    document.getElementById("depart").addEventListener("click", function () {
        document.getElementById("the_big_dice_container").style.display = "flex";
        this.style.display = 'none';
    });
    //ki u click dice is being rolled to give a random nbr
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
        document.getElementById('health-panel').style.display = 'block';
        document.getElementById('action-panel').style.display = 'flex';
        createHealthBars();
        createActionButtons();
        enableActionButtons(true);
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




    // -------------------------------- DEBUT ACTION BUTTONS ---------------------------------------------------//
    function createActionButtons() {
        const actionPanel = document.getElementById('action-panel');

        const actions = [
            { id: 'move', text: 'Se Déplacer' },
            { id: 'attack-rapid', text: 'Attaque Rapide' },
            { id: 'attack-heavy', text: 'Attaque Lourde' },
            { id: 'special', text: 'Pouvoir Spécial' },
            { id: 'defend', text: 'Se Défendre' },
            { id: 'dodge', text: 'Tenter Esquive' }
        ];

        actions.forEach(action => {
            const button = document.createElement('button');
            button.id = `btn-${action.id}`;
            button.classList.add('action-button');
            button.textContent = action.text;
            button.disabled = !actionButtonsEnabled;

            button.addEventListener('click', function() {
                handleActionButtonClick(action.id);
            });

            actionPanel.appendChild(button);
        });
    }
    function handleActionButtonClick(actionId) {
        if (!actionButtonsEnabled) return;

        const currentPlayer = players[currentPlayerIndex];

        // Reset all button styles
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Set active style for clicked button
        document.getElementById(`btn-${actionId}`).classList.add('active');

        currentAction = actionId;
        let actionCompleted = false;
        // Handle immediate actions
        switch(actionId) {
            case 'move':
                //alert("Utilisez les flèches du clavier pour vous déplacer.");
                break;

            case 'attack-rapid':
                actionCompleted = currentPlayer.attack('rapid');
                break;

            case 'attack-heavy':
                actionCompleted = currentPlayer.attack('heavy');
                break;

            case 'special':
                actionCompleted = currentPlayer.specialPower();
                break;

            case 'defend':
                actionCompleted = currentPlayer.defend();
                break;

            case 'dodge':
                actionCompleted = currentPlayer.dodge();
                break;
        }

        // If action is completed immediately (not movement), proceed to next turn
        if (actionCompleted) {
            resetActionButtons();
            nextTurn();
        }
    }
    function resetActionButtons() {
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.classList.remove('active');
        });
        currentAction = null;
    }
    function enableActionButtons(enable) {
        actionButtonsEnabled = enable;
        document.querySelectorAll('.action-button').forEach(btn => {
            btn.disabled = !enable;
        });
    }
    // -------------------------------- FIN ACTION BUTTONS ---------------------------------------------------//



    // -------------------------------- DEBUT HEALTH BARS ---------------------------------------------------//
    function createHealthBars() {
        const healthPanel = document.getElementById('health-panel');

        players.forEach((player, index) => {
            const playerContainer = document.createElement('div');
            playerContainer.classList.add('player-health-container');

            const playerLabel = document.createElement('div');
            playerLabel.classList.add('player-health-label');
            playerLabel.textContent = `Joueur ${index + 1} (${player.name})`;

            const healthBarContainer = document.createElement('div');
            healthBarContainer.classList.add('health-bar-container');

            const healthBar = document.createElement('div');
            healthBar.classList.add('health-bar');
            healthBar.id = `health-bar-${index}`;
            healthBar.style.width = '100%';

            const healthText = document.createElement('div');
            healthText.classList.add('health-text');
            healthText.id = `health-text-${index}`;
            healthText.textContent = `${player.health}/${INITIAL_HEALTH}`;

            healthBarContainer.appendChild(healthBar);
            healthBarContainer.appendChild(healthText);

            playerContainer.appendChild(playerLabel);
            playerContainer.appendChild(healthBarContainer);

            healthPanel.appendChild(playerContainer);
        });
    }
    function updateHealthBars() {
        players.forEach((player, index) => {
            const healthPercent = (player.health / INITIAL_HEALTH) * 100;
            const healthBar = document.getElementById(`health-bar-${index}`);
            const healthText = document.getElementById(`health-text-${index}`);

            healthBar.style.width = `${healthPercent}%`;
            healthText.textContent = `${player.health}/${INITIAL_HEALTH}`;

            // Change color based on health percentage
            if (healthPercent > 50) {
                healthBar.style.backgroundColor = 'green';
            } else if (healthPercent > 25) {
                healthBar.style.backgroundColor = 'orange';
            } else {
                healthBar.style.backgroundColor = 'red';
            }

            // Check if player is defeated
            if (player.health <= 0) {
                const playerIndex = players.findIndex(p => p === player);
                // Remove player from the game board
                if (player.position !== null) {
                    const caseDiv = document.querySelector(`#case-${player.position}`);
                    const img = caseDiv.querySelector('img');
                    const playerNumber = caseDiv.querySelector('.player-number');
                    if (img) caseDiv.removeChild(img);
                    if (playerNumber) caseDiv.removeChild(playerNumber);
                }

                // Check if game is over (one player left)
                const alivePlayers = players.filter(p => p.health > 0);
                if (alivePlayers.length === 1) {
                    const winnerIndex = players.findIndex(p => p === alivePlayers[0]);
                    alert(`Partie terminée! Joueur ${winnerIndex + 1} (${alivePlayers[0].name}) a gagné!`);
                    enableActionButtons(false);
                }
            }
        });
    }
    // -------------------------------- FIN HEALTH BARS ---------------------------------------------------//






    // -------------------------------- DEBUT WHO'S turn is now ? ---------------------------------------------------//
    let attackPriority = {};
    function updateTurnDisplay() {
        if (players.length > 0) {
            turnDisplay.textContent = `Tour de: Joueur ${currentPlayerIndex + 1} (${players[currentPlayerIndex].name})`;
            // Highlight current player's health bar
            document.querySelectorAll('.player-health-container').forEach((container, index) => {
                if (index === currentPlayerIndex) {
                    container.classList.add('active-player');
                } else {
                    container.classList.remove('active-player');
                }
            });
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
            // Skip defeated players
            let nextPlayerFound = false;
            let attempts = 0;
            let attackTypeOrder = [];
            for (let i = 0; i < playerOrder.length; i++) {
                const playerIdx = playerOrder[i];
                const attackType = attackPriority[playerIdx] || 'normal';
                attackTypeOrder.push({

                    playerIndex: playerIdx,
                attackType: attackType
        });
    }

                // Sort players by attack type priority: rapid > normal > heavy
                attackTypeOrder.sort((a, b) => {
                    if (a.attackType === 'rapid' && b.attackType !== 'rapid') return -1;
                    if (a.attackType !== 'rapid' && b.attackType === 'rapid') return 1;
                    if (a.attackType === 'normal' && b.attackType === 'heavy') return -1;
                    if (a.attackType === 'heavy' && b.attackType === 'normal') return 1;
                    return 0;
                });

                // Reset attack priorities for next round
                attackPriority = {};
            while (!nextPlayerFound && attempts < players.length) {
                // Use the player order determined by dice rolls
                const currentOrderIndex = attackTypeOrder.findIndex(p => p.playerIndex === currentPlayerIndex);
                const nextOrderIndex = (currentOrderIndex + 1) % attackTypeOrder.length;
                currentPlayerIndex = attackTypeOrder[nextOrderIndex].playerIndex;

                // Skip players with no health
                if (players[currentPlayerIndex].health > 0) {
                    nextPlayerFound = true;
                }

                attempts++;
            }

            updateTurnDisplay();
            resetActionButtons();
        }
    }
    // Modify handleActionButtonClick to store attack types
    // Function to handle key presses for movement
    //TODO : update so when game is over we go back to launch page
    function handleMovement(event) {
        if (players.length === 0 || !actionButtonsEnabled || currentAction !== 'move') return;

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

            // -----------------bech 2 or more players can be in the same case-----------------
            const autreJoueurSurCase = players.some(p => p !== currentPlayer && p.getPosition() === newPosition);
            if (autreJoueurSurCase) {
                currentPlayer.setPosition(oldPosition);
                alert("Cette case est déjà occupée par un autre joueur !");
                return;
            }
            //---------------------------------------------------------------------------------------

                updatePlayerPosition(currentPlayer, oldPosition);
                const skipNextTurn = checkCaseEffect(newPosition, currentPlayer);
                resetActionButtons();
                if (!skipNextTurn) {
                        nextTurn();
                    }

        }
    }
    // Function to check for special case effects
    function checkCaseEffect(position,player) {
        const caseInfo = cases.find(c => c.id === position);
        if (!caseInfo) return false;
        let keepTurn = false;
        // Check for bonuses
        if (caseInfo.element.classList.contains('bonus')) {
            const healthBonus = Math.floor(Math.random() * 15) + 5; // 5-19 health bonus
            player.health = Math.min(INITIAL_HEALTH, player.health + healthBonus);
            alert(`Bonus! ${player.name} gagne ${healthBonus} points de vie. Vous pouvez rejouer.`);
            caseInfo.element.classList.remove('bonus');
            updateHealthBars();
            keepTurn = true;
        }

        // Check for traps
        if (caseInfo.element.classList.contains('piege')) {
            const damage = Math.floor(Math.random() * 20) + 10; // 10-29 damage
            player.health = Math.max(0, player.health - damage);
            alert(`Piège! ${player.name} perd ${damage} points de vie. Vous perdez votre prochain tour.`);
            caseInfo.element.classList.remove('piege');
            updateHealthBars();
            // Skip to next player immediately
            nextTurn();
            keepTurn = true;
        }

        // Check for surprises
        if (caseInfo.element.dataset.surprise) {
            const surpriseType = caseInfo.element.dataset.surprise;

            if (surpriseType === 'bonus') {
                const healthBonus = Math.floor(Math.random() * 25) + 10; // 10-34 health bonus
                player.health = Math.min(INITIAL_HEALTH, player.health + healthBonus);
                alert(`Surprise positive! ${player.name} gagne ${healthBonus} points de vie et avance de 2 cases.`);

                // Try to move player forward 2 more spaces in the same direction
                const currentRow = Math.floor(position / TAILLE);
                const currentCol = position % TAILLE;

                // Determine last direction based on previous position
                let lastDirection = '';
                const oldPosition = player.position;

                if (position === oldPosition - TAILLE) lastDirection = 'up';
                else if (position === oldPosition + TAILLE) lastDirection = 'down';
                else if (position === oldPosition - 1) lastDirection = 'left';
                else if (position === oldPosition + 1) lastDirection = 'right';

                // Try to move in same direction if possible
                if (lastDirection) {
                    const extraMove = player.move(lastDirection);
                    if (extraMove) {
                        updatePlayerPosition(player, position);
                    }
                }
            } else if (surpriseType === 'piege') {
                const damage = Math.floor(Math.random() * 30) + 15; // 15-44 damage
                player.health = Math.max(0, player.health - damage);
                alert(`Surprise négative! ${player.name} perd ${damage} points de vie et recule de 2 cases.`);

                // Move player backward 2 spaces (opposite of last direction)
                const currentPosition = player.position;
                let oppositeDirection = '';

                const oldPosition = player.position;

                if (position === oldPosition - TAILLE) oppositeDirection = 'down';
                else if (position === oldPosition + TAILLE) oppositeDirection = 'up';
                else if (position === oldPosition - 1) oppositeDirection = 'right';
                else if (position === oldPosition + 1) oppositeDirection = 'left';

                // Try to move in opposite direction if possible
                if (oppositeDirection) {
                    const extraMove = player.move(oppositeDirection);
                    if (extraMove) {
                        updatePlayerPosition(player, position);
                    }
                }
            }

            // Remove the surprise after it's triggered
            delete caseInfo.element.dataset.surprise;
            caseInfo.element.innerText = "";
            updateHealthBars();
        }

        // Check if player has been defeated after effects
        if (player.health <= 0 && player.position !== null) {
            removePlayerFromBoard(player);
            player.position = null ;
            // Check if game is over (one player left)
            const alivePlayers = players.filter(p => p.health > 0);
            if (alivePlayers.length === 1) {
                const winnerIndex = players.findIndex(p => p === alivePlayers[0]);
                alert(`Partie terminée! Joueur ${winnerIndex + 1} (${alivePlayers[0].name}) a gagné!`);
                enableActionButtons(false);

            }
        }

        return keepTurn;
    }
    // Initialize the game
    function initGame() {
        console.log('Initializing game with', players.length, 'players');
        if (players.length > 0) {
            placePlayersInCorners();

            // Show dice rolling interface first
            document.getElementById('dice-container').style.display = 'flex';
            updateTurnDisplay();
        } else {
            console.error('No players available to initialize game');
        }

        // Add event listeners
        document.addEventListener('keydown', handleMovement);
    }
    // Start the game when everything is loaded
    initGame();
    // -------------------------------- FIN WHO'S turn is now ? ---------------------------------------------------//




    // -------------------------------- DEBUT DAMAGE EFFECT FUNCTIONS  ---------------------------------------------------//
    function applyDamageEffect(playerIndex) {
        const healthBar = document.getElementById(`health-bar-${playerIndex}`);
        if (healthBar) {
            // Add the class for animation
            healthBar.classList.add('damage-effect');

            // Remove the class after animation completes
            setTimeout(() => {
                healthBar.classList.remove('damage-effect');
            }, 500);
        }
    }

    // -------------------------------- FIN DAMAGE EFFECT FUNCTIONS  ---------------------------------------------------//


    // cuz for some fkn reason when they die they dont fkn dissapear
    function removePlayerFromBoard(player) {
        // Remove player image and number from the board
        const playerPosition = player.getPosition();
        if (playerPosition !== null) {
            const caseDiv = document.querySelector(`#case-${playerPosition}`);
            if (caseDiv) {
                // Find the player's exact elements by specific matching
                const playerIndex = players.findIndex(p => p === player);

                // Find and remove only the specific player's image
                Array.from(caseDiv.children).forEach(child => {
                    if (child.tagName === 'IMG' && child.alt === player.name) {
                        child.remove();
                    }
                    // Find and remove only the specific player's number div
                    if (child.classList.contains('player-number') &&
                        child.textContent === `Joueur ${playerIndex + 1}`) {
                        child.remove();
                    }
                });
            }
        }

        // Mark the player as removed from the board
        player.position = null;
    }

});

