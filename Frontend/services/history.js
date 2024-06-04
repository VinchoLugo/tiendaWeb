async function fetchHistoryData() {
    try {
        const response = await fetch('/get-history');
        console.log('Respuesta de obtener historial de compras:', response);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener el historial de compras desde el servidor:', error);
        return [];
    }
}

async function fetchGameData() {
    try {
        const response = await fetch('/src/catalog.json');
        console.log('Respuesta de obtener datos de juego:', response);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos del juego:', error);
        return [];
    }
}

async function fillTable() {
    const historyData = await fetchHistoryData();
    const gamesData = await fetchGameData();
    const tableBody = document.getElementById('purchase-history');
    tableBody.innerHTML = '';

    historyData.forEach(historyItem => {
        const game = gamesData.find(game => game.appid === historyItem.appid);
        if (game) {
            // Limpiar el valor del precio eliminando símbolos de moneda y separadores de miles
            const priceString = game.price.replace(/[^0-9.-]+/g,"");
            const price = parseFloat(priceString);
            const quantity = parseInt(historyItem.quantity, 10);

            const totalPrice = price * quantity;

            // Formatear la fecha en "YYYY-MM-DD"
            const purchaseDate = new Date(historyItem.purchase_date).toISOString().split('T')[0];

            // Obtener la descripción del juego a partir de los géneros
            const description = game.genre.join(', ');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${historyItem.id}</td>
                <td>${purchaseDate}</td>
                <td>${game.name}</td>
                <td>Mex $ ${price.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>Mex $ ${totalPrice.toFixed(2)}</td>
                <td>${description}</td>
                <td style="display: none;">${game.appid}</td>
            `;
            tableBody.appendChild(row);

            row.addEventListener('click', () => {
                const appid = row.querySelector('td:last-child').innerText;
                window.location.href = `/gameinfo?appid=${appid}`; // Redireccionar a la página de gameinfo con el app ID
            });
        }
    });
}


document.addEventListener('DOMContentLoaded', fillTable);
