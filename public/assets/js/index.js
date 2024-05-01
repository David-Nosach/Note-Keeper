document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.querySelector(".note-form");
  const noteTitle = document.querySelector(".note-title");
  const noteText = document.querySelector(".note-textarea");
  const saveNoteBtn = document.querySelector(".save-note");
  const newNoteBtn = document.querySelector(".new-note");
  const clearBtn = document.querySelector(".clear-btn");
  const noteList = document.querySelector("#list-group");

  const renderNoteList = (notes) => {
    noteList.innerHTML = "";
    notes.forEach((note) => {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.innerHTML = `<span class="list-item-title">${note.title}</span><i class="fas fa-trash-alt float-right text-danger delete-note"></i>`;
      li.dataset.noteId = note.id;
      noteList.appendChild(li);
    });
  };

  const getNotes = () => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then(renderNoteList);
  };

  const saveNote = (note) => {
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then((res) => res.json())
      .then(getNotes);
  };

  const deleteNote = (noteId) => {
    fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    }).then(getNotes);
  };

  const handleNoteSave = (e) => {
    e.preventDefault();
    const newNote = {
      title: noteTitle.value.trim(),
      text: noteText.value.trim(),
    };
    if (newNote.title && newNote.text) {
      saveNote(newNote);
      noteTitle.value = "";
      noteText.value = "";
    }
  };

  const handleNoteDelete = (e) => {
    if (e.target.classList.contains("delete-note")) {
      const noteId = e.target.parentElement.dataset.noteId;
      deleteNote(noteId);
    }
  };

  const handleNoteView = (e) => {
    if (e.target.matches(".list-group-item")) {
      const noteId = e.target.dataset.noteId;
      fetch(`/api/notes/${noteId}`)
        .then((res) => res.json())
        .then((note) => {
          noteTitle.value = note.title;
          noteText.value = note.text;
        });
    }
  };

  getNotes();

  noteForm.addEventListener("submit", handleNoteSave);
  noteList.addEventListener("click", handleNoteDelete);
  noteList.addEventListener("click", handleNoteView);
});
