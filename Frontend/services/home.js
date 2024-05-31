let allGames = [];

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
        container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

        games.forEach(async game => {
            const gameData = await fetchGameData(game.appid);
            if (gameData && gameData[game.appid] && gameData[game.appid].data) {
                const gameInfo = gameData[game.appid].data;

                const cardmamalon = document.createElement('div');
                cardmamalon.classList.add('cardmamalon');
                cardmamalon.setAttribute('data-appid', game.appid);

                const img = document.createElement('img');
                img.src = gameInfo.header_image;
                img.alt = gameInfo.name;

                const title = document.createElement('h3');
                title.classList.add('textCard');
                title.textContent = gameInfo.name;

                const price = document.createElement('p');
                if (gameInfo.price_overview && gameInfo.price_overview.final_formatted) {
                    price.textContent = gameInfo.price_overview.final_formatted;
                } else {
                    price.textContent = 'Precio no disponible';
                }

                cardmamalon.appendChild(img);
                cardmamalon.appendChild(title);
                cardmamalon.appendChild(price);

                container.appendChild(cardmamalon);

                cardmamalon.addEventListener('click', () => {
                    window.location.href = `/pages/gameinfo.html?appid=${gameInfo.steam_appid}`;
                });
            }
        });

    } catch (error) {
        console.error('Error al llenar los datos del juego:', error);
    }
}

async function fetchAndStoreGameData() {
    try {
        const response = await fetch('/src/catalog.json');
        const games = await response.json();

        allGames = games;
        fillGameData();

    } catch (error) {
        console.error('Error al obtener los datos del juego:', error);
    }
}

function filterGamesByGenre(genre) {
    const container = document.querySelector('#juegos-lista');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

    allGames.forEach(async game => {
        if (game.genre.includes(genre)) {
            const gameData = await fetchGameData(game.appid);
            if (gameData && gameData[game.appid] && gameData[game.appid].data) {
                const gameInfo = gameData[game.appid].data;

                const cardmamalon = document.createElement('div');
                cardmamalon.classList.add('cardmamalon');
                cardmamalon.setAttribute('data-appid', game.appid);

                const img = document.createElement('img');
                img.src = gameInfo.header_image;
                img.alt = gameInfo.name;

                const title = document.createElement('h3');
                title.classList.add('textCard');
                title.textContent = gameInfo.name;

                const price = document.createElement('p');
                if (gameInfo.price_overview && gameInfo.price_overview.final_formatted) {
                    price.textContent = gameInfo.price_overview.final_formatted;
                } else {
                    price.textContent = 'Precio no disponible';
                }

                cardmamalon.appendChild(img);
                cardmamalon.appendChild(title);
                cardmamalon.appendChild(price);

                container.appendChild(cardmamalon);

                cardmamalon.addEventListener('click', () => {
                    window.location.href = `/pages/gameinfo.html?appid=${gameInfo.steam_appid}`;
                });
            }
        }
    });
}

document.querySelectorAll('.genres button').forEach(button => {
    button.addEventListener('click', (event) => {
        const genre = event.target.textContent;
        filterGamesByGenre(genre);
    });
});

const createCarouselItem = (content, isActive) => {
    const div = document.createElement('div');
    div.className = 'carousel-item' + (isActive ? ' active' : '');
    const itemContainer = document.createElement('div');
    itemContainer.className = 'd-flex';
    itemContainer.appendChild(content);
    div.appendChild(itemContainer);
    return div;
};

async function createCarousel() {
    try {
        const response = await fetch('/src/catalog.json');
        const games = await response.json();

        const carouselInner = document.querySelector('#carousel-inner');
        carouselInner.innerHTML = ''; // Limpiar el carrusel antes de agregar nuevas imágenes

        games.forEach(async (game, index) => {
            const gameData = await fetchGameData(game.appid);
            if (gameData && gameData[game.appid] && gameData[game.appid].data) {
                const gameInfo = gameData[game.appid].data;

                const img = document.createElement('img');
                img.src = gameInfo.header_image;
                img.alt = gameInfo.name;
                img.className = 'd-block w-100';

                const carouselItem = createCarouselItem(img, index === 0); // La primera imagen es activa
                carouselInner.appendChild(carouselItem);

                img.addEventListener('click', () => {
                    window.location.href = `/pages/gameinfo.html?appid=${gameInfo.steam_appid}`;
                });
            }
        });

    } catch (error) {
        console.error('Error al crear el carrusel:', error);
    }
}


window.onload = function() {
    fetchAndStoreGameData();
    createCarousel();
};
/*
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
*/
