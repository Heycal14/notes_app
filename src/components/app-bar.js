class AppBar extends HTMLElement {
  static get observedAttributes() {
    return ['title-text'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  render() {
    const title = this.getAttribute('title-text') || 'Notes App';
    this.innerHTML = `
      <div class="app-bar-inner">
        <h1>${title}</h1>
      </div>
    `;
  }
}

customElements.define('app-bar', AppBar);
