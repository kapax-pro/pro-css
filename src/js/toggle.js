import { throttle } from 'lodash-es';

// DEFAULT IS TO TOGGLE A DEFAULT CLASS ON ITSELF WHEN CLICKED
// OPTIONS DEFINED IN DATA ATTRIBUTES
// OPTIONS INCLUDE EVENT(CLICK, SCROLL), TARGET(OTHER ELEMENT, multiple targets), CLASSES TO TOGGLE (multiple classes).
// YOU CAN DEFINE MULTIPLE TARGETS AND CLASSES BY SEPARATING BY COMMA, OR COMMA AND SPACE
class Toggle {
    event = 'click';
    cssClasses = ['is-visible'];
    targetSelectors = [];
    targetElements = [];
    scrollY = '0';

    constructor(toggleElement) {
        if(toggleElement.getAttribute('data-pro-event')) {
            this.event = toggleElement.getAttribute('data-pro-event');
        }
        if(toggleElement.getAttribute('data-pro-classes')) {
            this.cssClasses = toggleElement.getAttribute('data-pro-classes').split(/, */);
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

let toggleElements = [].slice.call(document.querySelectorAll('[data-pro-toggle]'));
let toggleList = toggleElements.map((toggleElement) => {
    return new Toggle(toggleElement);
});

export default Toggle
