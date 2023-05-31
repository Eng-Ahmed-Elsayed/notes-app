import React from "react"
import Sidebar from "./components/Sidebar"
import Editor from "./components/Editor"
import Split from "react-split"
// import {nanoid} from "nanoid"
import { addDoc, deleteDoc, doc, onSnapshot, setDoc } from "firebase/firestore"
import { notesCollection, db } from "./firebase"


export default function App() {
    const [notes, setNotes] = React.useState([])
    const [currentNoteId, setCurrentNoteId] = React.useState("")
    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
    // const sortedNotes = notes.sort((n1, n2) => (n1.updated < n2.updated) ? 1 
    // : (n1.updated > n2.updated) ? -1 
    // : 0
    // )
    const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt)

    React.useEffect(() => {
        const unSubscribe = onSnapshot(notesCollection, (snapshot) => {
            // Sync up our local notes array with the snapshot data
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }))
            setNotes(notesArr)
        })
        return unSubscribe
    }, [])

    React.useEffect(() => {
        if (!currentNoteId) {
            setCurrentNoteId(notes[0]?.id)
        }
    }, [notes])

    async function createNewNote() {
        // const current = new Date().toLocaleString()
        const current =  Date.now()
        const newNote = {
            body: "# Type your markdown note's title here",
            updated: current,
            created: current
        }
        const newNoteRef = await addDoc(notesCollection, newNote)
        setCurrentNoteId(newNoteRef.id)
    }
    
    async function updateNote(text) {
        // Update current note and put it at the top
        const current =  Date.now()
        // const current = new Date().toLocaleString()

        const docRef = doc(db, "notes", currentNoteId)
        await setDoc(docRef, {body: text, updated: current}, {merge: true})
    }
    
    async function deleteNote(noteId) {
        const docRef = doc(db, "notes", noteId)
        await deleteDoc(docRef)
    }
    
    return (
        <main>
        {
            notes.length > 0 
            ?
            <Split 
                sizes={[30, 70]} 
                direction="horizontal" 
                className="split"
            >
                <Sidebar
                    notes={sortedNotes}
                    currentNote={currentNote}
                    setCurrentNoteId={setCurrentNoteId}
                    newNote={createNewNote}
                    deleteNote={deleteNote}
                />
                <Editor 
                    currentNote={currentNote} 
                    updateNote={updateNote} 
                />
            </Split>
            :
            <div className="no-notes">
                <h1>You have no notes</h1>
                <button 
                    className="first-note" 
                    onClick={createNewNote}
                >
                    Create one now
                </button>
            </div>
            
        }
        </main>
    )
}
