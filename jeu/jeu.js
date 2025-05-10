document.addEventListener('DOMContentLoaded', function() { // Attendre que le DOM soit complètement chargé

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

            // Gestion de l'effet surprise sur clic

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



    function placePlayerInCorner(playerSelection){
        //kil mongela
        const cornerPositions = [TOP_LEFT_CORNER, TOP_RIGHT_CORNER,BOTTOM_RIGHT_CORNER,BOTTOM_LEFT_CORNER];
        playerSelection.forEach((selection,index) => {
            if (index < cornerPositions.length) {
                const playerCornerIndex = cornerPositions[index];
                const caseDiv = cases[playerCornerIndex].div;
                const img = document.createElement("img");
                img.src = selection.image ;
                img.alt = selection.name;
                img.classList.add('image');
                caseDiv.appendChild(img);
                const nameDiv = document.createElement("div");
                nameDiv.textContent = selection.name;
                caseDiv.appendChild(nameDiv);
            }
        })

    }


    //ki u click dice is being rolled to give a random nbr
    const  dice = document.getElementById('dice');
    dice.addEventListener('click',function (){
        const randomNumber = Math.floor(Math.random() * 6 ) + 1;
        dice.textContent = randomNumber ;
    })

    // to get the array that has the palyer's charcters
        const playerSelectionsData = localStorage.getItem('playerSelections');
        const playerSelections = JSON.parse(playerSelectionsData);
        if (playerSelections && playerSelections.length > 0) {
            console.log('Player selections:', playerSelections);
            placePlayerInCorner(playerSelections);
        } else {
            console.error('No player selections found in localStorage.');
        }





})





