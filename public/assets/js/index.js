const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveNoteBtn = $(".save-note");
const $newNoteBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

let activeNote = {};


let getNotes = function() {
    return $.ajax({
        url: "/api/notes",
        method: "GET",
    });
};

let saveNote = function(note) {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST",
    });
};

let deleteNote = function(id) {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE",
    });
};

let renderActiveNote = function() {
    $saveNoteBtn.hide();

    if (activeNote.id) {
        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    } else {
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");
    }
};

let handleNoteSave = function() {
    const newNote = {
        title: $noteTitle.val(),
        text: $noteText.val(),
    };

    saveNote(newNote).then(function(data) {

        getAndRenderNotes();
        renderActiveNote();


    });
};

let handleNoteDelete = function(event) {
    event.stopPropagation();

    let note = $(this).parent(".list-group-item").data();

    if (activeNote.id === note.id) {
        activeNote = {};
    }

    deleteNote(note.id).then(function() {

        getAndRenderNotes();
        renderActiveNote();
    });
};

let handleNoteView = function() {
    activeNote = $(this).data();
    renderActiveNote();
};

let handleNewNoteView = function() {
    activeNote = $(this).data();
    renderActiveNote();
};

let handleRenderSaveBtn = function() {
    if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
        $saveNoteBtn.hide();
    } else {
        $saveNoteBtn.show();
    }
};

let renderNoteList = function(notes) {
    $noteList.empty();

    let noteListItems = [];

    let create$li = function(text, withDeleteButton = true) {
        let $li = $("<li class='list-group-item'>");
        let $span = $("<span>").text(text);
        $li.append($span);

        if (withDeleteButton) {
            const $delBtn = $(
                "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
            );
            $li.append($delBtn);
        }
        return $li;
    };

    if (notes.length === 0) {
        noteListItems.push(create$li("No saved Notes", false));
    }

    notes.forEach((note) => {
        const $li = create$li(note.title).data(note);
        noteListItems.push($li);
    });

    $noteList.append(noteListItems);
};

const getAndRenderNotes = () => {
    return getNotes().then(renderNoteList);
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);


getAndRenderNotes();