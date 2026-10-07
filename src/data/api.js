const BASE_URL = 'https://notes-api.dicoding.dev/v2';

const NotesApi = {
  async getNotes() {
    const response = await fetch(`${BASE_URL}/notes`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      throw new Error(responseJson.message || 'Gagal mengambil catatan aktif');
    }

    return responseJson.data;
  },

  async getArchivedNotes() {
    const response = await fetch(`${BASE_URL}/notes/archived`);
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      throw new Error(responseJson.message || 'Gagal mengambil catatan arsip');
    }

    return responseJson.data;
  },

  async createNote({ title, body }) {
    const response = await fetch(`${BASE_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      throw new Error(responseJson.message || 'Gagal membuat catatan');
    }

    return responseJson.data;
  },

  async deleteNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}`, {
      method: 'DELETE',
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      throw new Error(responseJson.message || 'Gagal menghapus catatan');
    }

    return responseJson.message;
  },

  async archiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/archive`, {
      method: 'POST',
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      throw new Error(responseJson.message || 'Gagal mengarsipkan catatan');
    }

    return responseJson.message;
  },

  async unarchiveNote(id) {
    const response = await fetch(`${BASE_URL}/notes/${id}/unarchive`, {
      method: 'POST',
    });
    const responseJson = await response.json();

    if (responseJson.status !== 'success') {
      throw new Error(
        responseJson.message || 'Gagal memindahkan catatan dari arsip'
      );
    }

    return responseJson.message;
  },
};

export default NotesApi;
