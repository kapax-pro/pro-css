class ThemeToggle {
    constructor(themeToggleElement) {
        this.theme = themeToggleElement.getAttribute('data-toggle-theme');
        
        themeToggleElement.addEventListener('click', event => {
            event.preventDefault();
            document.querySelector('html').classList.toggle(this.theme);
            if(localStorage.theme == this.theme) {
                localStorage.theme = '';
            } else {
                localStorage.theme = this.theme;
            }
        });
    }
}

let themeToggleElements = [].slice.call(document.querySelectorAll('[data-toggle-theme]'));
let themeToggleList = themeToggleElements.map((themeToggleElement) => {
    return new ThemeToggle(themeToggleElement);
});

export default ThemeToggle
