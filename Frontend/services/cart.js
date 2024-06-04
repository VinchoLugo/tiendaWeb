document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();

    // Evento para limpiar el carrito
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    document.getElementById('purchase').addEventListener('click', purchase);
});

async function fetchAppIdsFromServer() {
    try {
        const response = await fetch('/get-cart');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los appid del carrito desde el servidor:', error);
        return [];
    }
}

async function fetchGameData() {
    try {
        const response = await fetch('/src/catalog.json');
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los datos del juego:', error);
        return [];
    }
}

async function displayCartItems() {
    const appIds = await fetchAppIdsFromServer();
    const gamesData = await fetchGameData();
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    if (appIds.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    const appIdsArray = appIds.map(item => item.appid);
    const appIdsCount = appIds.reduce((acc, curr) => {
        acc[curr.appid] = (acc[curr.appid] || 0) + 1;
        return acc;
    }, {});

    const cartItems = gamesData.filter(game => appIdsArray.includes(game.appid));
    cartItems.forEach(cartItem => {
        const cartItemElement = document.createElement('div');
        const price = parseFloat(cartItem.price.replace('Mex$ ', ''));
        const total = price * appIdsCount[cartItem.appid];
        
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${cartItem.header_image}" alt="${cartItem.name}" class="cart-item-image">
            <div class="cart-item-info">
                <p class="cart-item-name">${cartItem.name}</p>
                <p class="cart-item-quantity">Cantidad: ${appIdsCount[cartItem.appid]}</p>
                <p class="cart-item-price">Precio unitario: Mex$ ${price}</p>
                <p class="cart-item-total">Total: Mex$ ${total}</p>
            </div>
            <button class="remove-item-button" data-id="${cartItem.appid}" data-quantity="${appIdsCount[cartItem.appid]}">Eliminar</button>
        `;
        cartContainer.appendChild(cartItemElement);
    });

    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const appId = event.target.getAttribute('data-id');
            removeItemFromCart(appId);
        });
    });
}

async function removeItemFromCart(appId) {
    try {
        const response = await fetch('/remove-from-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ appid: appId })
        });

        if (response.ok) {
            // Remover visualmente la tarjeta del juego
            displayCartItems();
        } else {
            console.error('Error al eliminar el producto del carrito');
        }
    } catch (error) {
        console.error('Error al eliminar el producto del carrito:', error);
    }
}

async function clearCart() {
    try {
        const response = await fetch('/clear-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            // Limpiar visualmente el carrito
            displayCartItems();
        } else {
            console.error('Error al limpiar el carrito');
        }
    } catch (error) {
        console.error('Error al limpiar el carrito:', error);
    }
}

a// cart.js
async function purchase() {
    try {
        let total = 0;
        document.querySelectorAll('.cart-item').forEach(item => {
            const price = parseInt(item.querySelector('.cart-item-total').innerText.replace('Mex$ ', ''));
            total += price;
        });

        const response = await fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ total: total }) // Aquí envías el precio total al servidor
        });

        if (response.ok) {
            // Limpiar visualmente el carrito
            displayCartItems();
        } else {
            console.error('Error al realizar la compra');
        }
    } catch (error) {
        console.error('Error al realizar la compra:', error);
    }
}
