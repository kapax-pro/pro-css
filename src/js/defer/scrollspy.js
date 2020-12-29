import { throttle } from 'lodash-es';

class ScrollSpy {
    constructor(selector = '[data-scrollspy] a', config) {
        this._defaults = {
            navigationItemClass: 'active',
            contentItemClass: 'active',
            nested: false,
            nestedClass: 'active',
            offset: 0,
            reflow: true,
            events: false
        };
        this._config = this._getConfig(config);
        this._navigationItems = document.querySelectorAll(selector);

        this.refresh();
        this._process();

        window.addEventListener('scroll', throttle(() => {
            this._process();
        }, 50));
        if (this._config.reflow) {
            window.addEventListener('resize', throttle(() => {
                this._sortMatchedPairs();
                this._process();
            }, 100));
        }
    }

    refresh = () => {
        this._matchedPairs = [];

        this._navigationItems.forEach((navigationItem) => {
            let contentItem = document.getElementById(decodeURIComponent(navigationItem.hash.substr(1)));
            if(!contentItem) return;
            this._matchedPairs.push({
                navigationItem: navigationItem,
                contentItem: contentItem
            });
        }, this);

        this._sortMatchedPairs();
    }

    _process = () => {
        this._activePair = this._getActive();

        if (!this._activePair) {
            if (this._currentPair) {
                this._deactivate(this._currentPair);
                this._currentPair = null;
            }
            return;
        }

        if (this._currentPair && this._activePair.contentItem === this._currentPair.contentItem) return;

        this._deactivate(this._currentPair);
        this._activate(this._activePair);
        this._currentPair = this._activePair;
    }

    destroy = () => {
        if (this._currentPair) {
            this._deactivate(this._currentPair);
        }

        window.removeEventListener('scroll', this._process());
        if (this._config.reflow) {
            window.removeEventListener('resize', throttle());
        }

        this._matchedPairs = null;
        this._navigationItems = null;
        this._currentPair = null;
        this._config = null;
    }

    _getConfig(config) {
        config = {
            ...this._defaults,
            ...(typeof config === 'object' && config ? config : {})
        }
    
        return config;
    }

    _sortMatchedPairs = () => {
        if(this._matchedPairs) {
            this._matchedPairs.sort((matchedPair1, matchedPair2) => {
                let offset1 = this._getOffsetTop(matchedPair1.contentItem);
                let offset2 = this._getOffsetTop(matchedPair2.contentItem);
                if (offset1 < offset2) return -1;
                return 1;
            });
        }
    }

    _getActive = () => {
        let lastMatchedPair = this._matchedPairs[this._matchedPairs.length - 1];
        if (this._useLastItem(lastMatchedPair)) return lastMatchedPair;
        for (let i = this._matchedPairs.length - 1; i >= 0; i--) {
            if (this._isInView(this._matchedPairs[i].contentItem)) return this._matchedPairs[i];
        }
    }

    _useLastItem = (lastMatchedPair) => {
        if (this._isAtBottom() && this._isInView(lastMatchedPair.contentItem, true)) return true;
        return false;
    }

    _isAtBottom = () => {
        if (window.innerHeight + window.pageYOffset >= this._getDocumentHeight()) return true;
        return false;
    }

    _isInView = (element, checkIfAboveBottom) => {
        let bounds = element.getBoundingClientRect();
        let offset = this._getOffset();
        if (checkIfAboveBottom) {
            return parseInt(bounds.bottom, 10) < (window.innerHeight || document.documentElement.clientHeight);
        }
        return parseInt(bounds.top, 10) <= offset;
    }

    _getOffset = () => {
        if (typeof this._config.offset === 'function') {
            return parseFloat(this._config.offset());
        }

        return parseFloat(this._config.offset);
    }

    _getOffsetTop = element => {
        let location = 0;
        if (element.offsetParent) {
            while (element) {
                location += element.offsetTop;
                element = element.offsetParent;
            }
        }
        return location >= 0 ? location : 0;
    }

    _emitEvent = (type, element, detail) => {
        if (!this._config.events) return;

        let event = new CustomEvent(type, {
            bubbles: true,
            cancelable: true,
            detail: detail
        });

        element.dispatchEvent(event);
    }

    _getDocumentHeight = () => {
        return Math.max(
            document.body.scrollHeight, document.documentElement.scrollHeight,
            document.body.offsetHeight, document.documentElement.offsetHeight,
            document.body.clientHeight, document.documentElement.clientHeight
        );
    }

    _deactivate = (pair) => {
        if (!pair) return;

        pair.navigationItem.classList.remove(this._config.navigationItemClass);
        pair.contentItem.classList.remove(this._config.contentItemClass);

        // Deactivate any parent navs in a nested navigation
        // this._deactivateNested(li);

        this._emitEvent('scrollspyDeactivate', pair.navigationItem, {
            link: pair.navigationItem,
            content: pair.contentItem
        });
    }

    // _deactivateNested = (nav) => {
    //     // If nesting isn't activated, bail
    //     if (!this._config.nested || !nav.parentNode) return;

    //     // Get the parent navigation
    //     let li = nav.parentNode.closest('li');
    //     if (!li) return;

    //     // Remove the active class
    //     li.classList.remove(this._config.nestedClass);

    //     // Apply recursively to any parent navigation elements
    //     this._deactivateNested(li);
    // }

    // _activateNested = (nav) => {
    //     if (!this._config.nested) return;

    //     // Get the parent navigation
    //     let li = nav.parentNode.closest('li');
    //     if (!li) return;

    //     // Add the active class
    //     li.classList.add(settings.nestedClass);

    //     // Apply recursively to any parent navigation elements
    //     _activateNested(li);
    // }

    _activate = (pair) => {
        if (!pair) return;

        pair.navigationItem.classList.add(this._config.navigationItemClass)
        pair.contentItem.classList.add(this._config.contentItemClass)

        // Activate any parent navs in a nested navigation
        // this._activateNested(li, settings);

        this._emitEvent('scrollspyActivate', pair.navigationItem, {
            link: pair.navigationItem,
            content: pair.contentItem
        });
    }
}

// Maybe add event listener out here like bootstrap.
// That loops over all the selectors
// Add hard coded selector to data-attribute
if(document.querySelector('[data-scrollspy]')) {
    new ScrollSpy();
}

export default ScrollSpy
