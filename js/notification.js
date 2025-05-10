// notification.js

// Fonction pour afficher une notification
function showNotification(message, duration = 3000) {
    // Créer l'élément notification
    const notification = document.createElement('div');
    notification.classList.add('notification'); // Ajouter une classe pour le style
    notification.textContent = message; // Le texte de la notification

    // Ajouter la notification au body
    document.body.appendChild(notification);

    // Appliquer un effet de fondu (transition)
    setTimeout(() => {
        notification.classList.add('visible');
    }, 10); // Petite temporisation pour garantir que la classe 'visible' est ajoutée après l'ajout du div

    // Après le délai spécifié, on enlève la notification
    setTimeout(() => {
        // Retirer la notification du DOM
        notification.classList.remove('visible'); // Retirer l'effet de fondu
        setTimeout(() => {
            notification.remove(); // Supprimer l'élément du DOM après l'animation
        }, 500); // Un petit délai pour permettre à l'animation de se finir avant de supprimer l'élément
    }, duration);
}