document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.querySelector(".note-form");
  const noteTitle = document.querySelector(".note-title");
  const noteText = document.querySelector(".note-textarea");
  const saveNoteBtn = document.querySelector(".save-note");
  const newNoteBtn = document.querySelector(".new-note");
  const clearBtn = document.querySelector(".clear-btn");
  const noteList = document.querySelector("#list-group");

  // Function to show or hide the buttons based on input fields
  const handleRenderBtns = () => {
    if (noteTitle.value.trim() && noteText.value.trim()) {
      show(saveNoteBtn);
      show(clearBtn);
    } else {
      hide(saveNoteBtn);
      hide(clearBtn);
    }
  };

  // Show an element
  const show = (elem) => {
    elem.style.display = "inline";
  };

  // Hide an element
  const hide = (elem) => {
    elem.style.display = "none";
  };

  // Render list of notes
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

  // Function to get notes from the server
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
      .then((res) => res.json())
      .then(getNotes);
  };

  // Function to delete a note
  const deleteNote = (noteId) => {
    fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
    }).then(getNotes);
  };

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

  // Event listener to handle deletion of a note
  noteList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete-note")) {
      const noteId = e.target.parentElement.dataset.noteId;
      deleteNote(noteId);
    }
  });

  // Event listener to handle viewing a note
  noteList.addEventListener("click", (e) => {
    if (e.target.matches(".list-group-item")) {
      const noteId = e.target.dataset.noteId;
      fetch(`/api/notes/${noteId}`)
        .then((res) => res.json())
        .then((note) => {
          noteTitle.value = note.title;
          noteText.value = note.text;
        });
    }
  });

  // Event listeners to show/hide buttons based on input
  noteTitle.addEventListener("input", handleRenderBtns);
  noteText.addEventListener("input", handleRenderBtns);

  // Initial call to fetch notes
  getNotes();
});
