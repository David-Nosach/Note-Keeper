document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.querySelector(".note-form");
  const noteTitle = document.querySelector(".note-title");
  const noteText = document.querySelector(".note-textarea");
  const saveNoteBtn = document.querySelector(".save-note");
  const clearBtn = document.querySelector(".clear-btn");
  const noteList = document.querySelector("#list-group");
  const newNoteBtn = document.querySelector(".new-note");

  // Function to render list of notes
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

  // Function to fetch notes from server
  const getNotes = () => {
    fetch("/api/notes")
      .then((res) => res.json())
      .then(renderNoteList);
  };

  // Function to save a new note
  const saveNote = (note) => {
    fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(note),
    })
      .then(getNotes)
      .catch((error) => console.error("Error saving note:", error));
  };

  // Function to delete a note
  const deleteNote = (noteId) => {
    fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    })
      .then(getNotes)
      .catch((error) => console.error("Error deleting note:", error));
  };

  // Function to show an element
  const show = (elem) => {
    elem.style.display = "inline";
  };

  // Function to hide an element
  const hide = (elem) => {
    elem.style.display = "none";
  };

  // Function to handle rendering buttons based on input fields
  const handleRenderBtns = () => {
    const title = noteTitle.value.trim();
    const text = noteText.value.trim();

    if (title || text) {
      show(clearBtn);
    } else {
      hide(clearBtn);
    }

    if (title && text) {
      show(saveNoteBtn);
    } else {
      hide(saveNoteBtn);
    }

    if (!title && !text && !newNoteBtn.classList.contains("clicked")) {
      show(newNoteBtn);
    } else {
      hide(newNoteBtn);
    }
  };

  // Event listeners for input fields
  noteTitle.addEventListener("input", handleRenderBtns);
  noteText.addEventListener("input", handleRenderBtns);

  // Event listener to handle form submission (save new note)
  noteForm.addEventListener("submit", (e) => {
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
  });

  // Event listener to handle click on "Save Note" button
  saveNoteBtn.addEventListener("click", () => {
    const newNote = {
      title: noteTitle.value.trim(),
      text: noteText.value.trim(),
    };
    if (newNote.title && newNote.text) {
      saveNote(newNote);
      noteTitle.value = "";
      noteText.value = "";
    }
  });

  // Event listener to handle click on "Clear Form" button
  clearBtn.addEventListener("click", () => {
    noteTitle.value = "";
    noteText.value = "";
    hide(saveNoteBtn);
    hide(clearBtn);
  });

  // Event listener to handle click on "New Note" button
  newNoteBtn.addEventListener("click", () => {
    noteTitle.value = "";
    noteText.value = "";
    newNoteBtn.classList.add("clicked");
    handleRenderBtns();
  });

  // Event listener to handle click on notes in the list
  noteList.addEventListener("click", (e) => {
    if (e.target.classList.contains("list-item-title")) {
      const noteId = e.target.parentElement.dataset.noteId;
      fetch(`/api/notes/${noteId}`)
        .then((res) => res.json())
        .then((note) => {
          noteTitle.value = note.title;
          noteText.value = note.text;
          hide(saveNoteBtn);
          hide(clearBtn);
          show(newNoteBtn);
        })
        .catch((error) => console.error("Error fetching note:", error));
    } else if (e.target.classList.contains("delete-note")) {
      const noteId = e.target.parentElement.dataset.noteId;
      deleteNote(noteId);
    }
  });

  // Initial call to fetch notes
  getNotes();
});
