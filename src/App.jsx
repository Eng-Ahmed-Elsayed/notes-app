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
    const [tempNoteText, setTempNoteText] = React.useState("")
    
    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0]
    const sortedNotes = notes.sort((a, b) => b.updated - a.updated)

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

    React.useEffect(() => {
        currentNote && setTempNoteText(currentNote.body)
    }, [currentNote])

    React.useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (tempNoteText !== currentNote.body) {
                updateNote(tempNoteText)
            }
        }, 500)
        return () => clearTimeout(timeoutId)
    } ,[tempNoteText])

    async function createNewNote() {
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
        const docRef = doc(db, "notes", currentNoteId)
        const current =  Date.now()
        await setDoc(
            docRef, 
            {body: text, updated: current}, 
            {merge: true})
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
                    tempNoteText={tempNoteText} 
                    setTempNoteText={setTempNoteText} 
                />
                {/* <Editor 
                    currentNote={currentNote} 
                    updateNote={updateNote} 
                /> */}
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
