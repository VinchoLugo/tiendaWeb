async function fetchGameData(gameid) {
    try {
        const response = await fetch(`/steam/${gameid}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del juego:', error);
    }
}

async function fillGameData(gameid) {
    const gameData = await fetchGameData(gameid);
    const gameInfo = gameData[gameid].data;

    document.querySelector('.name').innerText += ' ' + gameInfo.name;
    document.querySelector('.description').innerText += ' ' + gameInfo.short_description;
    const genres = gameInfo.genres.map(genre => genre.description).join(', ');
    document.querySelector('.genre').innerText += ' ' + genres;
    document.querySelector('.age').innerText += ' ' + gameInfo.required_age;
    document.querySelector('.developer').innerText += ' ' + gameInfo.publishers;
    document.querySelector('.price').innerText += ' ' + gameInfo.price_overview.final_formatted;

    const carouselInner = document.querySelector('#carousel-inner');
    const headerContainer = document.querySelector('#header');

    const createCarouselItem = (content, isActive) => {
        const div = document.createElement('div');
        div.className = 'carousel-item' + (isActive ? ' active' : '');
        const itemContainer = document.createElement('div');
        itemContainer.className = 'd-flex';
        itemContainer.appendChild(content);
        div.appendChild(itemContainer);
        return div;
    };

    let itemCount = 0;
    let carouselGroup;

    gameInfo.movies.forEach((movie, index) => {
        const video = document.createElement('video');
        video.src = movie.mp4.max;
        video.className = 'd-block';

        if (itemCount % 4 === 0) {
            carouselGroup = createCarouselItem(video, index === 0);
            carouselInner.appendChild(carouselGroup);
        } else {
            carouselGroup.querySelector('.d-flex').appendChild(video);
        }

        itemCount++;

        video.addEventListener('click', () => {
            const headerVideo = document.createElement('video');
            headerVideo.src = movie.mp4.max;
            headerVideo.controls = true;
            headerVideo.autoplay = true;
            headerVideo.className = 'full-video';
            headerContainer.innerHTML = '';
            headerContainer.appendChild(headerVideo);
        });
    });

    gameInfo.screenshots.forEach((screenshot, index) => {
        const img = document.createElement('img');
        img.src = screenshot.path_thumbnail;
        img.className = 'd-block';

        if (itemCount % 4 === 0) {
            carouselGroup = createCarouselItem(img, itemCount === 0 && gameInfo.movies.length === 0);
            carouselInner.appendChild(carouselGroup);
        } else {
            carouselGroup.querySelector('.d-flex').appendChild(img);
        }

        itemCount++;

        img.addEventListener('click', () => {
            const headerImage = document.createElement('img');
            headerImage.src = screenshot.path_full;
            headerImage.className = 'full-image';
            headerContainer.innerHTML = '';
            headerContainer.appendChild(headerImage);
        });
    });

    if (gameInfo.movies.length > 0) {
        const firstVideo = document.createElement('video');
        firstVideo.src = gameInfo.movies[0].mp4.max;
        firstVideo.controls = true;
        firstVideo.autoplay = true;
        firstVideo.className = 'full-video';
        headerContainer.appendChild(firstVideo);
    } else if (gameInfo.screenshots.length > 0) {
        const firstImage = document.createElement('img');
        firstImage.src = gameInfo.screenshots[0].path_full;
        firstImage.className = 'full-image';
        headerContainer.appendChild(firstImage);
    }

    document.querySelector(".buybutton").addEventListener("click", () => {
        addToCart(gameInfo);
    });
}

function addToCart(game) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingGame = cart.find(item => item.id === game.steam_appid);

    if (existingGame) {
        existingGame.quantity++;
    } else {
        const gameItem = {
            id: game.steam_appid,
            name: game.name,
            price: game.price_overview.final,
            quantity: 1,
            header_image: game.header_image,
        };
        cart.push(gameItem);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${game.name} ha sido añadido al carrito.`);
}


window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const appid = urlParams.get('appid');

    fillGameData(appid);
};