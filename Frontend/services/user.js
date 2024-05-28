document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('userModal');
    const closeButton = document.querySelector('.close-button');
    const iconUser = document.querySelector('.icon-user');
    const userEmail = document.getElementById('userEmail');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');

    iconUser.addEventListener('click', () => {
        fetch('/get-user')
            .then(response => response.json())
            .then(data => {
                console.log('Datos recibidos del servidor:', data);
                if (data.email) {
                    userInfo.textContent = 'Informacion del usuario'
                    userName.textContent = `Nombre del usuario: ${data.user}`
                    console.log('Usuario', data.user);
                    console.log('Correo electrónico recibido:', data.email); 
                    userEmail.textContent = `Correo electronico: ${data.email}`;
                    modal.style.display = 'block';
                } else {
                    console.log('Redireccionando a /login');
                    window.location.href = '/login';
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos del servidor:', error);
            });
    });

    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
});
