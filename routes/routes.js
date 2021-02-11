const fs = require('fs');
const path = require('path');

module.exports = app => {

    // Notes variable
    fs.readFile("db/db.json", "utf8", (err, data) => {

        if (err) throw err;

        const notes = JSON.parse(data);

        // API Routes   

        // api/notes get route
        app.get("/api/notes", function(req, res) {
            res.json(notes);
        });

        // api/notes post route
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

        // Delete note 
        app.delete("/api/notes/:id", function(req, res) {
            notes.splice(req.params.id, 1);
            updateDb();
            console.log("Deleted note with id " + req.params.id);
        });

        // View Routes       


        app.get('/notes', function(req, res) {
            res.sendFile(path.join(__dirname, "../public/notes.html"));
        });

        app.get('*', function(req, res) {
            res.sendFile(path.join(__dirname, "../public/index.html"));
        });

        //Update db.json
        function updateDb() {
            fs.writeFile("db/db.json", JSON.stringify(notes, '\t'), err => {
                if (err) throw err;
                return true;
            });
        }

    });

}