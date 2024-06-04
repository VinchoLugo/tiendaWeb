let allGames = [];

async function fillGameData() {
    try {
        const response = await fetch('/src/catalog.json');
        const games = await response.json();

        const container = document.querySelector('#juegos-lista');
        container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

        games.forEach(game => {
            const cardmamalon = document.createElement('div');
            cardmamalon.classList.add('cardmamalon');
            cardmamalon.setAttribute('data-appid', game.appid);

            const img = document.createElement('img');
            img.src = game.header_image;
            img.alt = game.name;

            const title = document.createElement('h3');
            title.classList.add('textCard');
            title.textContent = game.name;

            const price = document.createElement('p');
            price.textContent = game.price ? game.price : 'Precio no disponible';

            cardmamalon.appendChild(img);
            cardmamalon.appendChild(title);
            cardmamalon.appendChild(price);

            container.appendChild(cardmamalon);

            cardmamalon.addEventListener('click', () => {
                window.location.href = `/pages/gameinfo.html?appid=${game.appid}`;
            });
        });

    } catch (error) {
        console.error('Error al llenar los datos del juego:', error);
    }
}

async function fetchAndStoreGameData() {
    try {
        const response = await fetch('/src/catalog.json');
        allGames = await response.json();
        fillGameData();
    } catch (error) {
        console.error('Error al obtener los datos del juego:', error);
    }
}

function filterGamesByGenre(genre) {
    const container = document.querySelector('#juegos-lista');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas tarjetas

    allGames.forEach(game => {
        if (game.genre.includes(genre)) {
            const cardmamalon = document.createElement('div');
            cardmamalon.classList.add('cardmamalon');
            cardmamalon.setAttribute('data-appid', game.appid);

            const img = document.createElement('img');
            img.src = game.header_image;
            img.alt = game.name;

            const title = document.createElement('h3');
            title.classList.add('textCard');
            title.textContent = game.name;

            const price = document.createElement('p');
            price.textContent = game.price ? game.price : 'Precio no disponible';

            cardmamalon.appendChild(img);
            cardmamalon.appendChild(title);
            cardmamalon.appendChild(price);

            container.appendChild(cardmamalon);

            cardmamalon.addEventListener('click', () => {
                window.location.href = `/pages/gameinfo.html?appid=${game.appid}`;
            });
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
        carouselInner.innerHTML = ''; // Limpiar el carrusel antes de agregar nuevas imÃ¡genes

        games.forEach((game, index) => {
            const img = document.createElement('img');
            img.src = game.header_image;
            img.alt = game.name;
            img.className = 'd-block w-100';

            const carouselItem = createCarouselItem(img, index === 0); // La primera imagen es activa
            carouselInner.appendChild(carouselItem);

            img.addEventListener('click', () => {
                window.location.href = `/pages/gameinfo.html?appid=${game.appid}`;
            });
        });

    } catch (error) {
        console.error('Error al crear el carrusel:', error);
    }
}

window.onload = function() {
    fetchAndStoreGameData();
    createCarousel();
};