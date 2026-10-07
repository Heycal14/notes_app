import './styles/style.css';
import './components/app-bar.js';
import './components/note-input.js';
import './components/note-item.js';
import './components/notes-list.js';
import './components/loading-indicator.js';
import NotesApi from './data/api.js';
import Swal from 'sweetalert2';
import { gsap } from 'gsap';

const activeNotesList = document.getElementById('activeNotes');
const archivedNotesList = document.getElementById('archivedNotes');
const loadingIndicator = document.getElementById('loadingIndicator');

const showLoading = () => loadingIndicator?.show();
const hideLoading = () => loadingIndicator?.hide();

async function loadNotes() {
  showLoading();
  try {
    const [activeNotes, archivedNotes] = await Promise.all([
      NotesApi.getNotes(),
      NotesApi.getArchivedNotes(),
    ]);

    if (activeNotesList) {
      activeNotesList.setAttribute('empty-message', 'Tidak ada catatan aktif');
      activeNotesList.notes = activeNotes;
    }

    if (archivedNotesList) {
      archivedNotesList.setAttribute(
        'empty-message',
        'Tidak ada catatan diarsipkan'
      );
      archivedNotesList.notes = archivedNotes;
    }

    gsap.from('.note-card', {
      opacity: 0,
      y: 15,
      duration: 0.35,
      stagger: 0.04,
      ease: 'power1.out',
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Catatan',
      text: error.message || 'Terjadi kesalahan saat memuat data catatan.',
    });
  } finally {
    hideLoading();
  }
}

// Event: Add Note
document.addEventListener('note-submit', async (e) => {
  const { title, body } = e.detail;

  showLoading();
  try {
    await NotesApi.createNote({ title, body });
    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Catatan berhasil ditambahkan.',
      timer: 1500,
      showConfirmButton: false,
    });
    await loadNotes();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menambahkan Catatan',
      text: error.message || 'Terjadi kesalahan saat menyimpan catatan.',
    });
  } finally {
    hideLoading();
  }
});

// Event: Toggle Archive
document.addEventListener('note-toggle-archive', async (e) => {
  const { id, archived } = e.detail;

  showLoading();
  try {
    if (archived) {
      await NotesApi.unarchiveNote(id);
    } else {
      await NotesApi.archiveNote(id);
    }

    await Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: archived
        ? 'Catatan dipindahkan ke catatan aktif.'
        : 'Catatan berhasil diarsipkan.',
      timer: 1500,
      showConfirmButton: false,
    });
    await loadNotes();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Mengubah Status Catatan',
      text:
        error.message || 'Terjadi kesalahan saat memperbarui arsip catatan.',
    });
  } finally {
    hideLoading();
  }
});

// Event: Delete Note
document.addEventListener('note-delete', async (e) => {
  const { id } = e.detail;

  const result = await Swal.fire({
    title: 'Hapus Catatan?',
    text: 'Catatan yang dihapus tidak dapat dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal',
  });

  if (!result.isConfirmed) return;

  showLoading();
  try {
    await NotesApi.deleteNote(id);
    await Swal.fire({
      icon: 'success',
      title: 'Terhapus!',
      text: 'Catatan berhasil dihapus.',
      timer: 1500,
      showConfirmButton: false,
    });
    await loadNotes();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal Menghapus Catatan',
      text: error.message || 'Terjadi kesalahan saat menghapus catatan.',
    });
  } finally {
    hideLoading();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
});
