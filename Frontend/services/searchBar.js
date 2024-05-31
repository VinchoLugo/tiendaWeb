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