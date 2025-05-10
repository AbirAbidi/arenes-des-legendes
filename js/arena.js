

// Fonction pour gérer l'interaction avec une case
function interagirAvecCase(position) {
  const element = cases[position].element;

  if (element.classList.contains('bonus')) {
    afficherNotification("🎁 Vous avez trouvé un BONUS !");
    element.classList.remove('bonus');
  } else if (element.classList.contains('piege')) {
    afficherNotification("💥 Vous êtes tombé sur un PIÈGE !");
  } else if (element.classList.contains('obstacle')) {
    afficherNotification("⛔ Vous avez rencontré un OBSTACLE !");
  } else if (element.dataset.surprise === 'bonus') {
    afficherNotification("🎁 Surprise ! C'était un BONUS caché !");
    delete element.dataset.surprise;
    element.innerText = "";
  } else if (element.dataset.surprise === 'piege') {
    afficherNotification("💥 Surprise ! C'était un PIÈGE caché !");
    delete element.dataset.surprise;
    element.innerText = "";
  }
}
