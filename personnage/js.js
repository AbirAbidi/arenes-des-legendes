// Liste des personnages
const personnages = [
    {
      nom: "Samurai",
      description: "Résistant et puissant en mêlée.",
      image: "C:/Users/Mega Pc/arenes-des-legendes/personnage/idl/Idle.png" // Ajout du ./ pour clarifier que c'est un chemin relatif
    },
    {
      nom: "Ninja",
      description: "Rapide et furtif dans l'ombre.",
      image: "C:/Users/Mega Pc/arenes-des-legendes/personnage/idl/Idle.png"
    },
    {
      nom: "Mage",
      description: "Maître des éléments magiques.",
      image: "C:/Users/Mega Pc/arenes-des-legendes/personnage/idl/Idle.png"
    }
  ];
  
  // Variables
  let index = 0;
  
  // Références aux éléments HTML
  const characterImage = document.getElementById('character-image');
  const characterName = document.getElementById('character-name');
  const characterDescription = document.getElementById('character-description');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  
  // Ajout d'un gestionnaire d'erreur pour les images
  characterImage.onerror = function() {
    console.error("Erreur de chargement de l'image: " + this.src);
    this.src = 'placeholder.png'; // Image de remplacement (créez un fichier placeholder.png)
    alert("Image non trouvée: " + this.src);
  };
  
  // Fonction pour afficher un personnage
  function afficherPersonnage(i) {
    characterImage.src = personnages[i].image;
    characterName.textContent = personnages[i].nom;
    characterDescription.textContent = personnages[i].description;
    console.log("Tentative de chargement de l'image: " + personnages[i].image);
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
  
  // Au chargement, afficher le premier personnage
  window.addEventListener('DOMContentLoaded', () => {
    afficherPersonnage(index);
  });
  // Référence au nouveau bouton
const selectBtn = document.getElementById('select-btn');

// Gestion du clic sur le bouton de sélection
selectBtn.addEventListener('click', () => {
  const personnageSelectionne = personnages[index];
  alert(`Vous avez sélectionné ${personnageSelectionne.nom}!`);
  // À ce stade, vous pouvez stocker le choix dans le localStorage
  // ou rediriger vers une autre page avec le personnage sélectionné
  localStorage.setItem('personnageChoisi', JSON.stringify(personnageSelectionne));
  
  // Pour tester si le localStorage fonctionne
  console.log('Personnage sauvegardé:', personnageSelectionne);
});