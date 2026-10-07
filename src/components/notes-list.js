class NotesList extends HTMLElement {
  static get observedAttributes() {
    return ['empty-message'];
  }

  constructor() {
    super();
    this._notes = [];
    this._emptyMessage = 'Tidak ada catatan';
  }

  set notes(notes) {
    this._notes = notes;
    this.render();
  }

  get notes() {
    return this._notes;
  }

  connectedCallback() {
    this._emptyMessage =
      this.getAttribute('empty-message') || 'Tidak ada catatan';
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'empty-message' && oldValue !== newValue) {
      this._emptyMessage = newValue || 'Tidak ada catatan';
      this.render();
    }
  }

  render() {
    if (!this.isConnected) return;

    if (!this._notes || this._notes.length === 0) {
      this.innerHTML = `
        <div class="notes-empty">
          <p>${this._emptyMessage}</p>
        </div>
      `;
      return;
    }

    this.innerHTML = `<div class="notes-grid"></div>`;
    const grid = this.querySelector('.notes-grid');

    this._notes.forEach((note) => {
      const noteItem = document.createElement('note-item');
      noteItem.note = note;
      grid.appendChild(noteItem);
    });
  }
}

customElements.define('notes-list', NotesList);
