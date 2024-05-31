document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();

    // Evento para limpiar el carrito
    document.getElementById('clear-cart').addEventListener('click', clearCart);
});

function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function displayCartItems() {
    const cartItems = getCartItems();
    const cartContainer = document.getElementById('cart-items');
    cartContainer.innerHTML = '';

    if (cartItems.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío</p>';
        return;
    }

    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.header_image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-quantity">Cantidad: ${item.quantity}</p>
                <p class="cart-item-price">Precio: ${item.price}</p>
            </div>
            <button class="remove-item-button" data-id="${item.id}">Eliminar</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    // Añadir eventos a los botones de eliminar
    document.querySelectorAll('.remove-item-button').forEach(button => {
        button.addEventListener('click', (event) => {
            removeFromCart(event.target.dataset.id);
        });
    });
}

function removeFromCart(gameId) {
    let cartItems = getCartItems();
    cartItems = cartItems.filter(item => item.id !== gameId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems();
}

function clearCart() {
    localStorage.removeItem('cart');
    displayCartItems();
}
