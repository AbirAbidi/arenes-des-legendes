// config.js
// Ce fichier contient la configuration initiale du jeu

// Initialisation des constantes et des variables globales
const TAILLE = 7;
const TOTAL_CASES = TAILLE * TAILLE;

const NB_OBSTACLES = 4;
const NB_BONUS = 4;
const NB_PIEGES = 4;
const NB_SURPRISES = 5;

// Chemins d'images
const playerIdleImage = 'idl/Idle.png';
const walkImages = [
  'walk/Walk0.png',
  'walk/Walk1.png',
  'walk/Walk2.png',
  'walk/Walk3.png',
  'walk/Walk4.png'
];
const jumpImages = [
  'jump/Jump1.png',
  'jump/Jump2.png',
  'jump/Jump3.png',
  'jump/Jump4.png',
  'jump/Jump5.png',
  'jump/Jump6.png',
  'jump/Jump7.png',
  'jump/Jump8.png'
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