class NoteInput extends HTMLElement {
  static get observedAttributes() {
    return ['max-title-length'];
  }

  constructor() {
    super();
    this._maxLength = 50;
  }

  connectedCallback() {
    this._maxLength = Number(this.getAttribute('max-title-length')) || 50;
    this.render();
    this.initEvents();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'max-title-length' && oldValue !== newValue) {
      this._maxLength = Number(newValue) || 50;
      this.render();
      this.initEvents();
    }
  }

  render() {
    this.innerHTML = `
      <form class="note-input-container" id="noteForm">
        <h2>Tambah Catatan Baru</h2>
        
        <div class="form-group">
          <label for="titleInput">Judul Catatan</label>
          <input 
            type="text" 
            id="titleInput" 
            placeholder="Tuliskan judul..." 
            maxlength="${this._maxLength}"
            required
          />
          <div class="input-feedback">
            <span class="validation-msg" id="titleValidation">Judul tidak boleh kosong</span>
            <span class="char-limit" id="charLimit">Sisa karakter: ${this._maxLength}</span>
          </div>
        </div>

        <div class="form-group">
          <label for="bodyInput">Isi Catatan</label>
          <textarea 
            id="bodyInput" 
            placeholder="Tuliskan isi catatan Anda di sini..." 
            rows="5"
            required
          ></textarea>
          <span class="validation-msg" id="bodyValidation">Isi catatan tidak boleh kosong</span>
        </div>

        <button type="submit" class="btn-submit" id="submitBtn">Buat Catatan</button>
      </form>
    `;
  }

  initEvents() {
    const form = this.querySelector('#noteForm');
    const titleInput = this.querySelector('#titleInput');
    const bodyInput = this.querySelector('#bodyInput');
    const charLimit = this.querySelector('#charLimit');
    const titleValidation = this.querySelector('#titleValidation');
    const bodyValidation = this.querySelector('#bodyValidation');

    if (!form || !titleInput || !bodyInput) return;

    // Realtime character limit & validation for title
    titleInput.addEventListener('input', (e) => {
      const currentLength = e.target.value.length;
      const remaining = this._maxLength - currentLength;
      charLimit.textContent = `Sisa karakter: ${remaining}`;

      if (remaining <= 5) {
        charLimit.classList.add('danger');
      } else {
        charLimit.classList.remove('danger');
      }

      if (e.target.value.trim() === '') {
        titleValidation.classList.add('visible');
      } else {
        titleValidation.classList.remove('visible');
      }
    });

    // Realtime validation for body
    bodyInput.addEventListener('input', (e) => {
      if (e.target.value.trim() === '') {
        bodyValidation.classList.add('visible');
      } else {
        bodyValidation.classList.remove('visible');
      }
    });

    // Submit handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = titleInput.value.trim();
      const body = bodyInput.value.trim();

      if (!title) {
        titleValidation.classList.add('visible');
        titleInput.focus();
        return;
      }

      if (!body) {
        bodyValidation.classList.add('visible');
        bodyInput.focus();
        return;
      }

      this.dispatchEvent(
        new CustomEvent('note-submit', {
          bubbles: true,
          detail: { title, body },
        })
      );

      form.reset();
      charLimit.textContent = `Sisa karakter: ${this._maxLength}`;
      charLimit.classList.remove('danger');
      titleValidation.classList.remove('visible');
      bodyValidation.classList.remove('visible');
    });
  }
}

customElements.define('note-input', NoteInput);
