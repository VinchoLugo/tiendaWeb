async function fetchGameData(gameid) {
    try {
        const response = await fetch(`/steam/${gameid}`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los datos del juego:', error);
    }
}

async function fillGameData(gameid){
    const gameData = await fetchGameData(gameid);
    const gameInfo = gameData[gameid].data;
    document.querySelector('.name').innerText += gameInfo.name;
    document.querySelector('.description').innerText += gameInfo.short_description;
    const genres = gameInfo.genres.map(genre => genre.description).join(', ');
    document.querySelector('.genre').innerText += genres;
    const carouselContainer = document.querySelector('#carousel');
    const headerContainer = document.querySelector('#header'); // Contenedor para imágenes y videos en el header

    // Agregar las imágenes al carrusel
    gameInfo.screenshots.forEach(screenshot => {
        const img = document.createElement('img');
        img.classList.add('below');
        img.src = screenshot.path_thumbnail;
        img.className = 'carousel-item';
        img.addEventListener('click', () => {
            const headerImage = document.createElement('img');
            headerImage.src = screenshot.path_full;
            headerImage.className = 'full-image';
            headerContainer.innerHTML = ''; // Limpiar el div
            headerContainer.appendChild(headerImage);
        });
        carouselContainer.appendChild(img);
    });

    // Agregar los videos al carrusel
    gameInfo.movies.forEach(movie => {
        const video = document.createElement('video');
        video.src = movie.mp4.max; // Usar el enlace del video mp4
        video.controls = true; // Mostrar controles de video
        video.className = 'carousel-item video-thumbnail'; // Añadir la clase 'video-thumbnail'
        video.addEventListener('click', () => {
            const headerVideo = document.createElement('video');
            headerVideo.src = movie.mp4.max;
            headerVideo.controls = true;
            headerVideo.className = 'full-video';
            headerContainer.innerHTML = ''; // Limpiar el div
            headerContainer.appendChild(headerVideo);
            console.log("entro al click");
        });
        carouselContainer.appendChild(video);
    });

    // Iniciar con la primera imagen o video cargado
    if (gameInfo.screenshots.length > 0) {
        const firstImage = document.createElement('img');
        firstImage.src = gameInfo.screenshots[0].path_full;
        firstImage.className = 'full-image';
        headerContainer.appendChild(firstImage);
    } else if (gameInfo.movies.length > 0) {
        const firstVideo = document.createElement('video');
        firstVideo.src = gameInfo.movies[0].mp4.max;
        firstVideo.controls = true;
        firstVideo.className = 'full-video';
        headerContainer.appendChild(firstVideo);
    }
}

window.onload = function() {
    // Supongamos que gameid lo obtienes de algún lugar, por ejemplo, de la URL
    const gameid = '105600'; // Reemplaza 'ID_DEL_JUEGO' con el ID real del juego
    fillGameData(gameid);
};

