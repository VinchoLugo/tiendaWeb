document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');

    // Comprobar la preferencia de tema del usuario
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.add('light-mode');
    }

    // Alternar tema al hacer clic en el botón
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');

        // Guardar la preferencia del usuario
        if (document.documentElement.classList.contains('light-mode')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.removeItem('theme');
        }
    });
});
