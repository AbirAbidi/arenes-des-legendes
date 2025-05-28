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
            this.disponibilite = 0;
        }

        setPosition(position) {
            this.position = position;
        }

        getPosition() {
            return this.position;
        }

        move(direction) {
            this.hideAttackDice();
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

        // why this , so lets say i click on rapid attack so the dice appeared but i changed my mind and i want to mive insead
        //without this it cant happen and the dice will always be there until u click it
        // and so i will add before the start of evey function in every class
        hideAttackDice() {
            const diceDiv = document.getElementById("div-dice-bottom");
            const attackDice = document.getElementById("attack-dice");
            diceDiv.style.display = "none";
            attackDice.textContent = "?";
            attackDice.onclick = null;
        }


        attack(attackType) {
            this.hideAttackDice();
            const adjacentPositions = this.getAdjacentPositions();
            const targets = players.filter(p => p !== this && adjacentPositions.includes(p.position));

            if (targets.length === 0) {
                alert("Aucun adversaire à proximité!");
                return false;
            }

            //  attack the first target found do ik is it on the right or on the left ( no i dont ) but again idgaf
            const target = targets[0];
            const targetIndex = players.findIndex(p => p === target);

            // Afficher le dé
            const diceDiv = document.getElementById("div-dice-bottom");
            const attackDice = document.getElementById("attack-dice");
            diceDiv.style.display = "flex";
            attackDice.textContent = "?";

            attackDice.onclick = (e) => {
                e.stopPropagation();
                const diceResult = Math.floor(Math.random() * 6) + 1;
                attackDice.textContent = diceResult.toString(); // idk why this is not working but the rsult shows in alert so idgaf
                let damage = 0;
                let attackMessage = `${this.name} tente une attaque sur ${target.name}`;
                if (diceResult <= 2) {
                    damage = 0;
                    attackMessage += ` mais échoue (résultat du dé: ${diceResult})`;
                } else if ([3, 4, 5].includes(diceResult) && attackType === 'rapid') {
                    damage = Math.floor(Math.random() * 8) + 8; // 8-15
                } else if (diceResult === 6 && attackType === 'rapid') {
                    damage = Math.floor(Math.random() * 12) + 15; // 15-26
                }else if ([3, 4, 5].includes(diceResult) && attackType === 'heavy') {
                    damage = Math.floor(Math.random() * 4) + 27; // 27-30
                }else if (diceResult === 6 && attackType === 'heavy') {
                    damage = Math.floor(Math.random() * 10) + 31; // 31-40
                }

                alert(`${attackMessage} pour ${damage} points de dégâts !`);
                // to see if there is defense fili 9balha
                if (target.isDefending) {
                    const reduced = Math.floor(damage / 2);
                    alert(`${target.name} se défend ! Dégâts réduits de ${damage} à ${reduced}.`);
                    damage = reduced ;
                    target.isDefending = false; // Réinitialiser la défense après l’attaque
                }
                target.health = Math.max(0, target.health - damage);
                applyDamageEffect(targetIndex);
                updateHealthBars();

                diceDiv.style.display = "none";
                attackDice.onclick = null;
                this.hideAttackDice();
            }


            return true;
        }

        specialPower(players) {
            alert(`${this.name} n'a pas de pouvoir spécial défini.`);
        }

        // m gonna make it take the damage and reduce it by half
        defend() {
            this.hideAttackDice();
            this.isDefending = true;
            alert(`${this.name} se prépare à défendre!`);
            return true;
        }

        // finish the dodge too ( idk how  m gonna to i dont get it)
        dodge() {
            alert("FUNCTIONNALITY NOT WORKING YET !")
        }

        // it takes oar defaut 1 et elle est hardcoded in sorcier a 2
        getAdjacentPositions(distance = 1) {
            const positions = [];

            for (let d = 1; d <= distance; d++) {
                positions.push(this.position - d * TAILLE); // Up
                positions.push(this.position + d * TAILLE); // Down
                positions.push(this.position - d);          // Left
                positions.push(this.position + d);          // Right
            }

            return positions.filter(pos => pos >= 0 && pos < TOTAL_CASES);
        }


        canUseSpecialPower(players) {
            if (this.disponibilite > 0) {
                alert(`Pouvoir spécial indisponible. Recharge : ${this.disponibilite} tour(s) restant(s).`);
                return false;
            }

            const adjacentPositions = this.getAdjacentPositions();
            const targets = players.filter(p => p !== this && p.health > 0 && adjacentPositions.includes(p.position));

            if (targets.length === 0) {
                alert("Aucun adversaire à proximité !");
                return false;
            }

            return true; // tout est ok
        }

    }
    class Chevalier extends Player {
        constructor() {
            super('chevalier', '/assets/characters/Chevalier.png');
        }
        specialPower(players) {
            this.hideAttackDice();
            if (!this.canUseSpecialPower(players)) return;
            const directions = [-1, 1, -TAILLE, TAILLE];
            const pos = this.getPosition();

            for (let dir of directions) {
                const targetPos = pos + dir;
                const target = players.find(p => p !== this && p.health > 0 && p.getPosition() === targetPos);
                if (target) {
                    const damage = 40;
                    target.health = Math.max(0, target.health - damage);
                    alert(`${this.name} utilise Coup de guerre ! ${target.name} subit ${damage} dégâts !`);
                    updateHealthBars();
                    applyDamageEffect(players.indexOf(target));
                    break;
                }
            }

            this.disponibilite = 3; // Recharge 3 tours
            nextTurn();

        }
    }
    class Ninja extends Player {
        constructor() {
            super('ninja', '/assets/characters/Ninja.png');
        }

        move(direction) {
            this.hideAttackDice();
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
//3leh hethi mr nefzi 5atir fi  cahier de charge lezim ninja ybougi w yajim yattaki 3leh ma nidrouch
            if (this.lastMoveValid) {
                this.setPosition(newPosition);

                setTimeout(() => {
                    let type = prompt("Tapez 'rapid' pour attaque rapide ou 'heavy' pour attaque lourde :").toLowerCase();
                    if (type === 'rapid' || type === 'heavy') { // njeh rabi 3leh 5atir bech ywali handling ta3 buttonet w eni fadit
                        this.attack(type);
                    } else {
                        alert("Type d'attaque invalide, attaque annulée.");
                    }
                    }, 100);// why 100 so movment visually will be done after alert appear ( 5ra ta3 dev rani)
            }

            return this.lastMoveValid;
        }

        specialPower(players) {
            this.hideAttackDice();
            if (!this.canUseSpecialPower(players)) return;
            alert(`${this.name} utilise Double attaque !`);

            for (let i = 0; i < 2; i++) {
                const target = players.find(p => p !== this && p.health > 0);
                if (target) {
                    const damage = Math.floor(Math.random() * 8) + 8; // 8-15
                    target.health = Math.max(0, target.health - damage);
                    alert(`${this.name} inflige ${damage} dégâts rapides à ${target.name}`);
                    applyDamageEffect(players.indexOf(target));
                }
            }

            updateHealthBars();
            this.disponibilite = 3;
            nextTurn();
        }

    }
    class Sorcier extends Player {
        constructor() {
            super('sorcier', '/assets/characters/Sorcier.png');
        }
        attack(attackType) {
            this.hideAttackDice();

            const adjacentPositions = this.getAdjacentPositions(2); //  on utilise 2 au lieu de 1
            const targets = players.filter(p => p !== this && adjacentPositions.includes(p.position));

            if (targets.length === 0) {
                alert("Aucun adversaire à proximité !");
                return false;
            }

            const target = targets[0];
            const targetIndex = players.findIndex(p => p === target);

            // Affichage du dé
            const diceDiv = document.getElementById("div-dice-bottom");
            const attackDice = document.getElementById("attack-dice");
            diceDiv.style.display = "flex";
            attackDice.textContent = "?";

            attackDice.onclick = (e) => {
                e.stopPropagation();
                const diceResult = Math.floor(Math.random() * 6) + 1;
                attackDice.textContent = diceResult.toString();

                let damage = 0;
                let attackMessage = `${this.name} tente une attaque sur ${target.name}`;

                if (diceResult <= 2) {
                    damage = 0;
                    attackMessage += ` mais échoue (résultat du dé: ${diceResult})`;
                } else if ([3, 4, 5].includes(diceResult) && attackType === 'rapid') {
                    damage = Math.floor(Math.random() * 8) + 8;
                } else if (diceResult === 6 && attackType === 'rapid') {
                    damage = Math.floor(Math.random() * 12) + 15;
                } else if ([3, 4, 5].includes(diceResult) && attackType === 'heavy') {
                    damage = Math.floor(Math.random() * 4) + 27;
                } else if (diceResult === 6 && attackType === 'heavy') {
                    damage = Math.floor(Math.random() * 10) + 31;
                }

                alert(`${attackMessage} pour ${damage} points de dégâts !`);

                if (target.isDefending) {
                    const reduced = Math.floor(damage / 2);
                    alert(`${target.name} se défend ! Dégâts réduits de ${damage} à ${reduced}.`);
                    damage = reduced;
                    target.isDefending = false;
                }

                target.health = Math.max(0, target.health - damage);
                applyDamageEffect(targetIndex);
                updateHealthBars();

                this.hideAttackDice();
            };

            return true;
        }

        specialPower(players) {
            this.hideAttackDice();
            if (!this.canUseSpecialPower(players)) return;
            alert(`${this.name} utilise Tempête magique !`);
            const directions = [-1, 1, -TAILLE, TAILLE];
            const pos = this.getPosition();

            for (let dir of directions) {
                const targetPos = pos + dir;
                const target = players.find(p => p !== this && p.health > 0 && p.getPosition() === targetPos);
                if (target) {
                    const damage = Math.floor(Math.random() * 10) + 15; // 15-24
                    target.health = Math.max(0, target.health - damage);
                    alert(`${target.name} est touché par la tempête magique et perd ${damage} HP.`);
                    applyDamageEffect(players.indexOf(target));
                }
            }

            updateHealthBars();
            this.disponibilite = 3;
            nextTurn();
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






    // -------------------------------- DEBUT DICE PLAYER ORDER ---------------------------------------------------//
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
    // -------------------------------- FIN DICE PLAYER ORDER ---------------------------------------------------//




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
        switch(actionId) {
            case 'move':
                break;

            case 'attack-rapid':
                actionCompleted = currentPlayer.attack('rapid');
                break;

            case 'attack-heavy':
                actionCompleted = currentPlayer.attack('heavy');
                break;

            case 'special':
                actionCompleted = currentPlayer.specialPower(players);
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
                    localStorage.clear();
                    setTimeout(() => {
                        window.location.href = '../lauch page/launch_page.html';
                    }, 2000);
                }
            }
        });
    }
    //this function to apply damage ( it affects the health bars )
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
    // -------------------------------- FIN HEALTH BARS ---------------------------------------------------//




    //----------------------------------- DEBUT SHOW LIST OF TOUR DISPO FOR SPECIAL POWER --------------------------------------------------
    renderPlayersList(players)
    //----------------------------------- FIN SHOW LIST OF TOUR DISPO FOR SPECIAL POWER --------------------------------------------------




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
            // Si le joueur actuel est mort, sauter directement
            if (players[currentPlayerIndex].health <= 0) {
                let found = false;
                for (let i = 0; i < players.length; i++) {
                    const idx = (currentPlayerIndex + i + 1) % players.length;
                    if (players[idx].health > 0) {
                        currentPlayerIndex = idx;
                        found = true;
                        break;
                    }
                }
            }

            let nextPlayerFound = false;
            let attempts = 0;

            // Liste des joueurs vivants avec leurs priorités d'attaque
            let attackTypeOrder = [];
            for (let i = 0; i < playerOrder.length; i++) {
                const playerIdx = playerOrder[i];
                const player = players[playerIdx];
                if (player.health > 0) {
                    const attackType = attackPriority[playerIdx] || '';
                    attackTypeOrder.push({
                        playerIndex: playerIdx,
                        attackType: attackType
                    });
                }
            }

            // Tri des priorités d'attaque
            attackTypeOrder.sort((a, b) => {
                const priority = {
                    'rapid': 0,
                    '': 1,
                    'heavy': 2
                };

                return priority[a.attackType] - priority[b.attackType];
            });

            // Réinitialiser les priorités
            attackPriority = {};

            // Passer au prochain joueur vivant
            while (!nextPlayerFound && attempts < attackTypeOrder.length) {
                const currentOrderIndex = attackTypeOrder.findIndex(p => p.playerIndex === currentPlayerIndex);
                const nextOrderIndex = (currentOrderIndex + 1) % attackTypeOrder.length;
                currentPlayerIndex = attackTypeOrder[nextOrderIndex].playerIndex;

                if (players[currentPlayerIndex].health > 0) {
                    nextPlayerFound = true;
                }

                attempts++;
            }


            updateTurnDisplay();
            resetActionButtons();
            if (players[currentPlayerIndex].disponibilite > 0) {
                players[currentPlayerIndex].disponibilite--;
            }
            updateSpecialPowerCooldownDisplay();

        }
    }
    function updateSpecialPowerCooldownDisplay() {
        players.forEach((player, index) => {
            const playerElem = document.getElementById(`player-${index}`);
            if (playerElem) {
                const cooldownElem = playerElem.querySelector('.special-power-cooldown');
                if (cooldownElem) {
                    if (player.disponibilite > 0) {
                        cooldownElem.textContent = `Recharge : ${player.disponibilite} tour${player.disponibilite > 1 ? 's' : ''}`;
                    } else {
                        cooldownElem.textContent = `Pouvoir disponible`;
                    }
                }
            }
        });
    }
    function renderPlayersList() {
        const playersList = document.getElementById('players-list');
        playersList.innerHTML = ''; // vider la liste avant

        players.forEach((player, index) => {
            const li = document.createElement('li');
            li.id = `player-${index}`;
            li.innerHTML = `Joueur ${index + 1} - <span class="special-power-cooldown">Pouvoir disponible</span>`;
            playersList.appendChild(li);
        });
    }
    // Modify handleActionButtonClick to store attack types
    // Function to handle key presses for movement
    function handleMovement(event) {
        if (players.length === 0 || !actionButtonsEnabled || currentAction !== 'move') return;

        const currentPlayer = players[currentPlayerIndex];
        let direction = '';

        // Determine direction based on key press
        if (event.key === 'ArrowUp') direction = 'up';
        else if (event.key === 'ArrowDown') direction = 'down';
        else if (event.key === 'ArrowLeft') direction = 'left';
        else if (event.key === 'ArrowRight') direction = 'right';

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

            // -----------------bech 2 or more players cant be in the same case-----------------
            const autreJoueurSurCase = players.some(p =>
                p !== currentPlayer && p.getPosition() === newPosition && p.health>0);
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
            if(player.health === 100) {
                alert("Tu peux rejouer !");
                caseInfo.element.classList.remove('bonus');
                keepTurn = true;
            }else{
            const healthBonus = Math.floor(Math.random() * 15) + 5; // 5-19 health bonus
            player.health = Math.min(INITIAL_HEALTH, player.health + healthBonus);
            alert(`Bonus! ${player.name} gagne ${healthBonus} points de vie. Vous pouvez rejouer.`);
            caseInfo.element.classList.remove('bonus');
            updateHealthBars();
            keepTurn = true;
            }
        }

        // Check for traps
        if (caseInfo.element.classList.contains('piege')) {
            const damage = Math.floor(Math.random() * 20) + 10; // 10-29 damage
            player.health = Math.max(0, player.health - damage);
            alert(`Piège! ${player.name} perd ${damage} points de vie.`);
            caseInfo.element.classList.remove('piege');
            updateHealthBars();
            // Skip to next player immediately
            nextTurn();
            keepTurn = true;
        }

        // Check for surprises  which is the ?  it can be good or bad
        if (caseInfo.element.dataset.surprise) {
            const surpriseType = caseInfo.element.dataset.surprise;

            if (surpriseType === 'bonus') {
                const healthBonus = Math.floor(Math.random() * 25) + 10; // 10-34 health bonus
                if(player.health ===100){
                    alert("Ton HeathBar est pleine , pas de surprise pour vous !");
                }else{
                player.health = Math.min(INITIAL_HEALTH, player.health + healthBonus);
                alert(`Surprise positive! ${player.name} gagne ${healthBonus} points de vie.`);
                }
            } else if (surpriseType === 'piege') {
                const damage = Math.floor(Math.random() * 30) + 15; // 15-44 damage
                player.health = Math.max(0, player.health - damage);
                alert(`Surprise négative! ${player.name} perd ${damage} points de vie.`);
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
    // when they die the  get erased
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






});

