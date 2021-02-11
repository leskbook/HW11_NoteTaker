const fs = require('fs');
const path = require('path');

module.exports = app => {

    // Setup notes variable
    fs.readFile("db/db.json", "utf8", (err, data) => {

        if (err) throw err;

        let notes = JSON.parse(data);

        // API Routes   

        //api/notes get route
        app.get("/api/notes", function(req, res) {
            res.json(notes);
        });

        //api/notes post route
        app.post("/api/notes", function(req, res) {
            let newNote = req.body;
            notes.push(newNote);
            updateDb();
            return console.log("Added new note: " + newNote.title);
        });

        // Get notes
        app.get("/api/notes/:id", function(req, res) {
            res.json(notes[req.params.id]);
        });

        // Deletes a note by id
        app.delete("/api/notes/:id", function(req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id " + req.params.id);
        });

        // VIEW Routes       

        // Display notes.html when /notes is accessed
        app.get('/notes', function(req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

        // Display index.html when all other routes are accessed
        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        //Update Json
        function updateDb() {
            fs.writeFile("db/db.json", JSON.stringify(notes, '\t'), err => {
                if (err) throw err;
                return true;
            });
        }

    });

}