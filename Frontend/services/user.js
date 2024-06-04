document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('userModal');
    const closeButton = document.querySelector('.close-button');
    const iconUser = document.querySelector('.icon-user');
    const iconCart = document.querySelector('.icon-cart'); // Selecciona el ícono del carrito de compras correctamente

    const userEmail = document.getElementById('userEmail');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');

    if (iconUser) {
        iconUser.addEventListener('click', () => {
            fetch('/get-user')
                .then(response => response.json())
                .then(data => {
                    if (data.email) {
                        userInfo.textContent = 'Información del usuario';
                        userName.textContent = `Nombre del usuario: ${data.user}`;
                        userEmail.textContent = `Correo electrónico: ${data.email}`;
                        modal.style.display = 'block';
                    } else {
                        window.location.href = '/login';
                    }
                })
                .catch(error => {
                    console.error('Error al obtener los datos del servidor:', error);
                });
        });
    }

    if (iconCart) {
        iconCart.addEventListener('click', () => {
            fetch('/get-user')
                .then(response => response.json())
                .then(data => {
                    if (data.email) {
                        window.location.href = '/cart'; // Redirige al carrito si el usuario está autenticado
                    } else {
                        alert('Por favor, inicie sesión para acceder al carrito de compras.');
                        window.location.href = '/login'; // Redirige a la página de login
                    }
                })
                .catch(error => {
                    console.error('Error al verificar la autenticación del usuario:', error);
                });
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });

    viewHistoryButton.addEventListener('click', () => {
        window.location.href = '/pages/history.html';
    });
});
