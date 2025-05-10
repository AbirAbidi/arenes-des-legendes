document.addEventListener('DOMContentLoaded', function() { // Attendre que le DOM soit complètement chargé

// -------------------------------- DEBUT CREATION ARENE ET CASES ---------------------------------------------------//
    function positionAleatoire() {
        let pos;
        do {
            pos = Math.floor(Math.random() * TOTAL_CASES);
        } while (positionsUtilisées.has(pos));
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
            caseDiv.addEventListener('click', function() {
                this.classList.add('surprise');
                setTimeout(() => this.classList.remove('surprise'), 500);

                const elem = cases[i].element;
                // Utilisation de notifications au lieu des alertes pour éviter de bloquer l'animation
                if (elem.classList.contains('bonus')) {
                    afficherNotification("🎁 Vous avez découvert un BONUS !");
                } else if (elem.classList.contains('piege')) {
                    afficherNotification("💥 Oh non, un PIÈGE !");
                } else if (elem.classList.contains('obstacle')) {
                    afficherNotification("⛔ C'est un OBSTACLE !");
                } else if (elem.dataset.surprise === 'bonus') {
                    afficherNotification("🎁 Surprise ! C'était un BONUS caché !");
                } else if (elem.dataset.surprise === 'piege') {
                    afficherNotification("💥 Surprise ! C'était un PIÈGE caché !");
                } else {
                    afficherNotification("🔍 Rien de spécial ici...");
                }
            });
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




})





