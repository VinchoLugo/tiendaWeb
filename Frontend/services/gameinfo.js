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

    // Función para crear elementos del carrusel
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

    // Agregar videos al carrusel
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

        // Evento click para mostrar en el header
        video.addEventListener('click', () => {
            const headerVideo = document.createElement('video');
            headerVideo.src = movie.mp4.max;
            headerVideo.controls = true;
            headerVideo.autoplay = true; // Auto play here
            headerVideo.className = 'full-video';
            headerContainer.innerHTML = '';
            headerContainer.appendChild(headerVideo);
        });
    });

    // Agregar imágenes al carrusel
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

        // Evento click para mostrar en el header
        img.addEventListener('click', () => {
            const headerImage = document.createElement('img');
            headerImage.src = screenshot.path_full;
            headerImage.className = 'full-image';
            headerContainer.innerHTML = '';
            headerContainer.appendChild(headerImage);
        });
    });

    // Iniciar con el primer video cargado en el header
    if (gameInfo.movies.length > 0) {
        const firstVideo = document.createElement('video');
        firstVideo.src = gameInfo.movies[0].mp4.max;
        firstVideo.controls = true;
        firstVideo.autoplay = true; // Auto play here
        firstVideo.className = 'full-video';
        headerContainer.appendChild(firstVideo);
    } else if (gameInfo.screenshots.length > 0) {
        const firstImage = document.createElement('img');
        firstImage.src = gameInfo.screenshots[0].path_full;
        firstImage.className = 'full-image';
        headerContainer.appendChild(firstImage);
    }
}

window.onload = function() {
    const gameid = '339800'; // Reemplaza 'ID_DEL_JUEGO' con el ID real del juego
    fillGameData(gameid);
};