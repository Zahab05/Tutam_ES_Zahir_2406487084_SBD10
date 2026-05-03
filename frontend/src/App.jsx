import { useState, useEffect } from "react";
import { fetchNotes, createNote, deleteNote } from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotes();
      setNotes(data);
    } catch (err) {
      setError("Gagal memuat catatan. Pastikan backend berjalan.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

    try {
      setSubmitting(true);
      setError(null);
      const newNote = await createNote(content);
      setNotes((prev) => [newNote, ...prev]);
      setContent("");
    } catch (err) {
      setError(err.message || "Gagal membuat catatan.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setError(null);
      await deleteNote(id);
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (err) {
      setError("Gagal menghapus catatan.");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <span className="app-header__icon">📝</span>
        <h1 className="app-header__title">NoteZ</h1>
        <p className="app-header__subtitle">
          Simpan catatan Anda dengan cepat dan mudah
        </p>
      </header>

      {error && <div className="error-toast">{error}</div>}

      <form className="note-form" onSubmit={handleCreate} id="note-form">
        <input
          id="note-input"
          className="note-form__input"
          type="text"
          placeholder="Tulis catatan baru..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={submitting}
          autoFocus
        />
        <button
          id="note-submit"
          className="note-form__btn"
          type="submit"
          disabled={!content.trim() || submitting}
        >
          {submitting ? "Menyimpan..." : "Tambah"}
        </button>
      </form>

      {!loading && notes.length > 0 && (
        <div className="notes-counter">
          <span className="notes-counter__label">Catatan Anda</span>
          <span className="notes-counter__badge">{notes.length} catatan</span>
        </div>
      )}

      {loading ? (
        <div className="loading">
          <div className="loading__spinner" />
        </div>
      ) : notes.length === 0 ? (
        <div className="notes-list__empty">
          <span className="notes-list__empty-icon">📭</span>
          Belum ada catatan. Mulai menulis sekarang!
        </div>
      ) : (
        <div className="notes-list" id="notes-list">
          {notes.map((note) => (
            <div className="note-card" key={note.id} id={`note-${note.id}`}>
              <div className="note-card__content">
                <p className="note-card__text">{note.content}</p>
                <span className="note-card__date">
                  {formatDate(note.created_at)}
                </span>
              </div>
              <button
                className="note-card__delete"
                onClick={() => handleDelete(note.id)}
                title="Hapus catatan"
                id={`delete-${note.id}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
