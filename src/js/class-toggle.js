class ClassToggle {
    cssClasses = ['is-visible'];
    targetElements = [];

    constructor(toggleElement) {
        if(toggleElement.getAttribute('data-toggle-class')) {
            this.cssClasses = toggleElement.getAttribute('data-toggle-class').split(/, */);
        }

        this.targetElements = document.querySelectorAll(toggleElement.getAttribute('data-target'));
        
        toggleElement.addEventListener('click', () => {
            if(this.targetElements) {
                this.targetElements.forEach((targetElement) => {
                    this.cssClasses.forEach((cssClass) => {
                        targetElement.classList.toggle(cssClass);
                    });
                });
            }
        });
    }
}

let classToggleElements = [].slice.call(document.querySelectorAll('[data-toggle-class]'));
let classToggleList = classToggleElements.map((toggleElement) => {
    return new ClassToggle(toggleElement);
});

export default ClassToggle
