class LoadingIndicator extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  show() {
    this.classList.remove('hidden');
  }

  hide() {
    this.classList.add('hidden');
  }

  render() {
    this.innerHTML = `
      <div class="loading-overlay">
        <div class="spinner"></div>
        <p class="loading-text">Memuat data...</p>
      </div>
    `;
  }
}

customElements.define('loading-indicator', LoadingIndicator);
