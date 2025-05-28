//    Pour plus de détails sur le fonctionnement du jeu, veuillez consulter le fichier jeu.js


// Initialisation des constantes et des variables globales
const TAILLE = 7;
const TOTAL_CASES = TAILLE * TAILLE;

const NB_OBSTACLES = 4;
const NB_BONUS = 4;
const NB_PIEGES = 4;
const NB_SURPRISES = 5;

//hethi like win bech yit7atou les characteres
const TOP_LEFT_CORNER = 0 ;
const TOP_RIGHT_CORNER = TAILLE -1 ; // which is taille -1 = 7-1
const BOTTOM_RIGHT_CORNER = TOTAL_CASES - 1 ;// 7*7 -1
const BOTTOM_LEFT_CORNER = TOTAL_CASES - TAILLE // total_cases - taille


// Tableau des cases de l'arène et des positions utilisées
const positionsUtilisées = new Set();
const cases = [];

//touskie player
const INITIAL_HEALTH = 100 ;