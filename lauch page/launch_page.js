// Liste des personnages
const personnages = [
    {
      nom: "Guerrier",
      specialite :"Haute défense, bon en duel",
      image: "/assets/characters/guerrier.png",
    },

  {
    nom: "Archer",
    specialite :"Peut tirer sans s’exposer directement",
    image: "/assets/characters/archer.png",
  },

    {
      nom: "Mage",
      specialite :"Sorts de zone ou puissants, faible défense",
      image: "/assets/characters/mage.png"
    }

  ];
  

  
  const characterImage = document.getElementById('character-image');
  const characterName = document.getElementById('character-name');
  const characterSpeciality = document.getElementById('character-specialite');
  const prevBtn = document.getElementById('previous');
  const nextBtn = document.getElementById('next');
  const selectBtn = document.getElementById('select-btn');

let index = 0;

function afficherPersonnage(i) {
    characterImage.src = personnages[i].image;
    characterName.textContent = personnages[i].nom;
  characterSpeciality.textContent = personnages[i].specialite;
  }
  
  // Bouton gauche
  prevBtn.addEventListener('click', () => {
    index = (index - 1 + personnages.length) % personnages.length;
    afficherPersonnage(index);
  });
  
  // Bouton droite
  nextBtn.addEventListener('click', () => {
    index = (index + 1) % personnages.length;
    afficherPersonnage(index);
  });

  // Au chargement, afficher le premier personnage (sans celle-ci on aura une image vide au premier chargement )
  window.addEventListener('DOMContentLoaded', () => {
    afficherPersonnage(index);
  });


  // for the green button "selectionner" to store what selected
selectBtn.addEventListener('click', () => {
    const personnageSelectionne = personnages[index];
    let confirmation = window.confirm("Vous avez choisi cette personnage , Voulez vous confirmer votre choix ?");
    if (confirmation) {
      localStorage.setItem('personnageChoisi', JSON.stringify(personnageSelectionne));
      console.log('Personnage sauvegardé:', personnageSelectionne);
      window.location.href = '../jeu/jeu.html';
    }

});