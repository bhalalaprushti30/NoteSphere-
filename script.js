document.addEventListener("DOMContentLoaded", () => {
    const addNoteBtn = document.getElementById("addNote");
    const notesContainer = document.getElementById("notesContainer");
    const searchInput = document.getElementById("search");
    const toggleDarkModeBtn = document.getElementById("toggleDarkMode");

    function loadNotes() {
        notesContainer.innerHTML = "";
        const notes = JSON.parse(localStorage.getItem("notes") || "[]");
        notes.forEach((note, index) => createNoteElement(note.text, note.color, note.pinned, index));
    }

    function saveNotes() {
        const notes = Array.from(document.querySelectorAll(".note"))
            .map(note => ({
                text: note.querySelector("textarea").value,
                color: note.style.backgroundColor,
                pinned: note.classList.contains("pinned")
            }));
        localStorage.setItem("notes", JSON.stringify(notes));
    }

    function createNoteElement(text = "", color = "yellow", pinned = false, index) {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");
        if (pinned) noteDiv.classList.add("pinned");
        noteDiv.style.backgroundColor = color;
        
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.addEventListener("input", saveNotes);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "X";
        deleteBtn.classList.add("delete");
        deleteBtn.addEventListener("click", () => {
            if (confirm("Delete this note?")) {
                noteDiv.remove();
                saveNotes();
            }
        });
        
        const pinBtn = document.createElement("button");
        pinBtn.innerText = "📌";
        pinBtn.classList.add("pin");
        pinBtn.addEventListener("click", () => {
            noteDiv.classList.toggle("pinned");
            saveNotes();
            loadNotes();
        });
        
        const colorPicker = document.createElement("input");
        colorPicker.type = "color";
        colorPicker.value = color;
        colorPicker.addEventListener("input", (e) => {
            noteDiv.style.backgroundColor = e.target.value;
            saveNotes();
        });
        
        noteDiv.appendChild(textarea);
        noteDiv.appendChild(deleteBtn);
        noteDiv.appendChild(pinBtn);
        noteDiv.appendChild(colorPicker);
        notesContainer.appendChild(noteDiv);
    }
    
    addNoteBtn.addEventListener("click", () => {
        createNoteElement();
        saveNotes();
    });
    
    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        document.querySelectorAll(".note").forEach(note => {
            note.style.display = note.querySelector("textarea").value.toLowerCase().includes(query) ? "block" : "none";
        });
    });
    
    toggleDarkModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });
    
    loadNotes();
});
