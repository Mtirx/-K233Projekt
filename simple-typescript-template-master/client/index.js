function logout() {
    localStorage.removeItem('token');
    
    window.location.href = '/login';
}

document.addEventListener('DOMContentLoaded', () => {
    const logoutLink = document.querySelector('a[href="#"]');
    
    if (logoutLink) {
        logoutLink.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
});
