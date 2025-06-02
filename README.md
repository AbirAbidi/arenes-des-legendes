# Jeu Arene des legendes - Guide technique

## Lancement du jeu

- Ouvrir le fichier `launch_page.html` dans un navigateur web moderne (Chrome, Firefox, Edge...).
- Le jeu se charge automatiquement et est prêt à être utilisé.

## Structure des fichiers

- `launch_page.html` : page principale pour lancer le jeu.
- `jeu.js` : contient la logique de déplacement et gestion des joueurs.
- `jeu.css` : styles pour l’affichage de la grille et des éléments du jeu.

## Description technique

- Le jeu utilise une grille carrée dont la taille est définie par la constante `TAILLE` (file = configuration.js).
- Chaque case de la grille est indexée de 0 à `TOTAL_CASES - 1`.
- Le déplacement est validé uniquement si la nouvelle position reste dans les limites de la grille.
- Si le déplacement est invalide (sortie de la grille), un indicateur `lastMoveValid` est mis à `false`.

## Contrôles

- Les déplacements sont contrôlés via les touches clavier (flèches directionnelles).
- À chaque commande, la position du joueur est recalculée et l’affichage est mis à jour en conséquence.


## Notes

- Le code est facilement adaptable à différentes tailles de grilles.
- Le système peut gérer jusqu'à 4 joueurs et détecter leurs positions adjacentes.
