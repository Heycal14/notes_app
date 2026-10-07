class NoteItem extends HTMLElement {
  static get observedAttributes() {
    return ['note-id', 'note-title', 'note-body', 'note-date', 'is-archived'];
  }

  set note(note) {
    this._note = note;
    this.render();
  }

  get note() {
    return this._note;
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  formatDate(dateString) {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  }

  render() {
    if (!this.isConnected) return;

    const id = this._note ? this._note.id : this.getAttribute('note-id');
    const title = this._note
      ? this._note.title
      : this.getAttribute('note-title') || '';
    const body = this._note
      ? this._note.body
      : this.getAttribute('note-body') || '';
    const createdAt = this._note
      ? this._note.createdAt
      : this.getAttribute('note-date') || new Date().toISOString();
    const archived = this._note
      ? this._note.archived
      : this.getAttribute('is-archived') === 'true';

    if (!id) return;

    this.innerHTML = `
      <article class="note-card" data-id="${id}">
        <div class="note-card-header">
          <h3>${this.escapeHTML(title)}</h3>
          <p class="note-card-date">${this.formatDate(createdAt)}</p>
        </div>
        <p class="note-card-body">${this.escapeHTML(body)}</p>
        <div class="note-card-actions">
          <button type="button" class="btn-action btn-archive" data-action="toggle-archive">
            ${archived ? 'Pindahkan ke Aktif' : 'Arsipkan'}
          </button>
          <button type="button" class="btn-action btn-delete" data-action="delete">
            Hapus
          </button>
        </div>
      </article>
    `;

    this.querySelector('[data-action="toggle-archive"]')?.addEventListener(
      'click',
      () => {
        this.dispatchEvent(
          new CustomEvent('note-toggle-archive', {
            bubbles: true,
            detail: { id, archived },
          })
        );
      }
    );

    this.querySelector('[data-action="delete"]')?.addEventListener(
      'click',
      () => {
        this.dispatchEvent(
          new CustomEvent('note-delete', {
            bubbles: true,
            detail: { id },
          })
        );
      }
    );
  }

  escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
}

customElements.define('note-item', NoteItem);
