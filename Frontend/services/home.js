async function fetchGameData(gameid) {
    try {
        const response = await fetch(`/steam/${gameid}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del juego:', error);
    }
}

async function fillGameData() {
    try {
        const response = await fetch('/src/catalog.json');
        const games = await response.json();

        const container = document.querySelector('#juegos-lista');

        games.forEach(async game => {
            const gameData = await fetchGameData(game.appid);
            if (gameData && gameData[game.appid] && gameData[game.appid].data) {
                const gameInfo = gameData[game.appid].data;
        
                const card = document.createElement('div');
                card.classList.add('card');
                card.setAttribute('data-appid', game.appid); // Almacena el appid en el atributo data-appid
        
                const img = document.createElement('img');
                img.src = gameInfo.header_image;
                img.alt = gameInfo.name;
        
                const title = document.createElement('h3');
                title.textContent = gameInfo.name;
        
                const price = document.createElement('p');
                price.textContent = gameInfo.price_overview.final_formatted;
        
                card.appendChild(img);
                card.appendChild(title);
                card.appendChild(price); // Agrega el precio a la tarjeta
        
                container.appendChild(card);
        
                // Agrega un evento click a la tarjeta para redirigir a gameinfo.html con el appid
                card.addEventListener('click', () => {
                    window.location.href = `/pages/gameinfo.html?appid=${game.appid}`;
                });
            }
        });
        
    } catch (error) {
        console.error('Error al llenar los datos del juego:', error);
    }
}

window.onload = function() {
    fillGameData();
};
