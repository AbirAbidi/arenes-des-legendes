

// Initialisation des constantes et des variables globales
const TAILLE = 7;
const TOTAL_CASES = TAILLE * TAILLE;

const NB_OBSTACLES = 4;
const NB_BONUS = 4;
const NB_PIEGES = 4;
const NB_SURPRISES = 5;

const characterOne = '/assets/player.png';
const characterTwo = '/assets/player2.png';

const walkImages = [
  '/assets/walk/Walk0.png',
  '/assets/walk/Walk1.png',
  '/assets/walk/Walk2.png',
  '/assets/walk/Walk3.png',
  '/assets/walk/Walk4.png'
];
const jumpImages = [
  '/assets/jump/Jump1.png',
  '/assets/jump/Jump2.png',
  '/assets/jump/Jump3.png',
  '/assets/jump/Jump4.png',
  '/assets/jump/Jump5.png',
  '/assets/jump/Jump6.png',
  '/assets/jump/Jump7.png',
  '/assets/jump/Jump8.png'
];

// Variables globales d'état du jeu
let joueurPosition = null;
let isMoving = false;
let isJumping = false;
let walkIndex = 0;
let jumpIndex = 0;
let walkInterval;
let jumpInterval;

// Tableau des cases de l'arène et des positions utilisées
const positionsUtilisées = new Set();
const cases = [];