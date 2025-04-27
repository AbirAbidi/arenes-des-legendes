function nbrSelected(){
    const player_nbr = document.querySelector('input[name="nbr"]:checked')
    document.getElementById('selected_nbr').innerText = "Joueur N° : " + player_nbr.value;
    const radios = document.getElementsByName('nbr')
    for (let radio of radios ){
        radio.addEventListener("chnage",nbrSelected)
    }
}