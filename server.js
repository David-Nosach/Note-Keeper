// Importing necessary modules
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Creating an instance of Express
const app = express();
const PORT = process.env.PORT || 3000; // Setting the port number, defaulting to 3000 if not provided by environment variable

// Middleware
// Configuring middleware to handle form data and JSON data, and serving static files from the 'public' directory
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Routes
// Setting up routes for serving HTML files
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Sending the index.html file located in the 'public' directory
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html")); // Sending the notes.html file located in the 'public' directory
});

// API routes
// Handling GET request to retrieve all notes
app.get("/api/notes", (req, res) => {
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data)); // Sending the parsed JSON data read from the db.json file
  });
});

// Handling GET request to retrieve a specific note by ID
app.get("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    const note = notes.find((note) => note.id === noteId);
    if (note) {
      res.json(note); // Sending the found note as JSON if it exists
    } else {
      res.status(404).send("Note not found"); // Sending 404 status if the note is not found
    }
  });
});

// Handling POST request to add a new note
app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4(); // Assigning a unique ID using uuid
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);
    notes.push(newNote); // Adding the new note to the array of notes
    fs.writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(notes), // Writing the updated array of notes back to the db.json file
      (err) => {
        if (err) throw err;
        res.json(newNote); // Sending the added note as JSON response
      }
    );
  });
});

// Handling DELETE request to delete a note by ID
app.delete("/api/notes/:id", (req, res) => {
  const noteId = req.params.id;
  fs.readFile(path.join(__dirname, "db", "db.json"), "utf8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId); // Filtering out the note to be deleted
    fs.writeFile(
      path.join(__dirname, "db", "db.json"),
      JSON.stringify(notes), // Writing the filtered array of notes back to the db.json file
      (err) => {
        if (err) throw err;
        res.sendStatus(200); // Sending a success status code
      }
    );
  });
});

// Start server
// Starting the server and listening on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
