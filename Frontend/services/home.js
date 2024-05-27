document.addEventListener('DOMContentLoaded', () => {
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
                    card.setAttribute('data-appid', game.appid);
            
                    const img = document.createElement('img');
                    img.src = gameInfo.header_image;
                    img.alt = gameInfo.name;
            
                    const title = document.createElement('h3');
                    title.textContent = gameInfo.name;
            
                    const price = document.createElement('p');
                    price.textContent = gameInfo.price_overview.final_formatted;
            
                    card.appendChild(img);
                    card.appendChild(title);
                    card.appendChild(price);
            
                    container.appendChild(card);
            
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

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const autocompleteList = document.getElementById('autocomplete-list');

    // Función para filtrar y mostrar juegos en la lista de autocompletado
    function filterGames(query) {
        autocompleteList.innerHTML = '';
        fetch('/src/catalog.json')
            .then(response => response.json())
            .then(games => {
                const filteredGames = games.filter(game => game.name.toLowerCase().includes(query));
                filteredGames.forEach(game => {
                    const div = document.createElement('div');
                    div.textContent = game.name;
                    div.addEventListener('click', () => {
                        window.location.href = `/pages/gameinfo.html?appid=${game.appid}`;
                    });
                    autocompleteList.appendChild(div);
                });
            })
            .catch(error => console.error('Error al obtener los juegos:', error));
    }

    // Manejador de evento para la entrada de búsqueda
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query) {
            filterGames(query);
        } else {
            autocompleteList.innerHTML = '';
        }
    });

    // Función para realizar la búsqueda
    function performSearch(query) {
        fetch('/src/catalog.json')
            .then(response => response.json())
            .then(games => {
                const game = games.find(game => game.name.toLowerCase() === query.toLowerCase());
                if (game) {
                    window.location.href = `/pages/gameinfo.html?appid=${game.appid}`;
                } else {
                    alert('Juego no encontrado');
                }
            })
            .catch(error => console.error('Error al realizar la búsqueda:', error));
    }

    // Manejador de evento para el botón de búsqueda
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase();
        performSearch(query);
    });

    // Manejador de evento para la tecla Enter en la entrada de búsqueda
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.toLowerCase();
            performSearch(query);
        }
    });

    // Manejador de evento para cerrar la lista de autocompletado al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput && e.target.parentNode !== autocompleteList) {
            autocompleteList.innerHTML = '';
        }
    });
});
