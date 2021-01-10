import { throttle } from 'lodash-es';

class ClassToggle {
    cssClasses = ['is-visible'];
    scrollY = '0';

    constructor(toggleElement) {
        if(toggleElement.getAttribute('data-event')) {
            this.event = toggleElement.getAttribute('data-event');
        } else {
            this.event = 'click';
        }
        this.target = toggleElement.getAttribute('data-target');
        if(toggleElement.getAttribute('data-toggle-class')) {
            this.cssClasses = toggleElement.getAttribute('data-toggle-class');
        }


        this.targetElements = document.querySelectorAll(toggleElement.getAttribute('data-pro-targets'));
        this.scrollY = toggleElement.getAttribute('data-pro-scrolly');
        
        if(this.event == 'click') {
            toggleElement.addEventListener('click', () => {
                if(this.targetElements) {
                    this.targetElements.forEach((targetElement) => {
                        this.cssClasses.forEach((cssClass) => {
                            targetElement.classList.toggle(cssClass);
                        });
                    });
                }
            });
        } else if(this.event == 'scroll') {
            window.addEventListener('scroll', throttle(() => {
                if(scrollY > this.scrollY) {
                    this.targetElements[0].classList.remove(this.cssClasses[0])
                } else {
                    this.targetElements[0].classList.add(this.cssClasses[0])
                }
            }, 50));
        }
    }
}

let classToggleElements = [].slice.call(document.querySelectorAll('[data-toggle-class]'));
let classToggleList = classToggleElements.map((toggleElement) => {
    return new ClassToggle(toggleElement);
});

export default ClassToggle
