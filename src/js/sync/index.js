document.documentElement.classList.add('js');

if(localStorage.getItem('darkMode') !== null) {
    document.documentElement.classList.add('dark-mode');
}
