
if ('registerElement' in document) {

  class WebShareWrapper extends HTMLElement {
    constructor() {
      super();

      this.webShare = 'share' in navigator;
      if (this.webShare) {
        this.text = document.createTextNode(this.getAttribute('text') || 'Share');
        this.button = document.createElement('button');
        this.button.appendChild(this.text);
        this.innerHTML = '';
        this.appendChild(this.button);
      }
    }

    connectedCallback() {
      if (this.webShare) {
        this.button.addEventListener('click', event => {
          const shareOptions = {
            title: this.getTitle(),
            text: this.getText(),
            url: this.getUrl()
          };
          navigator
            .share(shareOptions)
            .then(() => this.successfulShare(shareOptions))
            .catch(error => this.abortedShare(error, shareOptions));
        });
      }
    }

    successfulShare(options) {
      const event = new CustomEvent('share-success', options);
      this.dispatchEvent(event, {
        detail: options
      });
    }

    abortedShare(error, options) {
      options['error'] = error;
      const event = new CustomEvent('share-failure', {
        detail: options
      });
      this.dispatchEvent(event);
    }

    getTitle() {
      return (
        this.getAttribute('sharetitle') ||
        document.querySelector('title').textContent
      );
    }

    getText() {
      return this.getAttribute('sharetext');
    }

    getUrl() {
      if (this.getAttribute('shareurl')) {
        return this.getAttribute('shareurl');
      }
      const canonicalElement = document.querySelector('link[rel=canonical]');
      if (canonicalElement !== null) {
        return canonicalElement.getAttribute('href');
      }
      return window.location.href;
    }
  }

  customElements.define('web-share-wrapper', WebShareWrapper);

}
