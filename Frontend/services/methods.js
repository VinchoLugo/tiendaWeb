document.addEventListener('DOMContentLoaded', () => {
    const fetchJuegos = async () => {
        try {
            const response = await fetch('http://localhost:3000/juegos');
            const data = await response.json();
            renderJuegos(data);
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

   /* const renderJuegos = (juegos) => {
        const juegosLista = document.getElementById('juegos-lista');
        juegos.forEach(juego => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <h2>${juego.nombre}</h2>
                <p>Plataforma: ${juego.plataforma}</p>
                <p>Género: ${juego.genero}</p>
                <p>Precio: ${juego.precio}</p>
                <p>Descripción: ${juego.descripcion}</p>
                <p>Clasificación: ${juego.clasificacion}</p>
                <img src="${juego.imagen_url}" alt="${juego.nombre}">
            `;
            juegosLista.appendChild(card);
        });
    }; */

    const renderJuegos = (juegos) => {
        const juegosLista = document.getElementById('juegos-lista');
        juegos.forEach(juego => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = `
                <img src="${juego.imagen_url}" alt="${juego.nombre}">
                <h2>${juego.nombre}</h2>
                <p>$${juego.precio}</p>
            `;
            juegosLista.appendChild(card);
        });
    };

    fetchJuegos();
});
