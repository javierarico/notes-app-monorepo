import React, {useRef, useState} from 'react';
import Toggable from './Toggable';

export default function NoteForm ({addNote, handleLogout}) {
    const [newNote, setNewNote] = useState('');
    const toggableRef = useRef();

    const handleChange = (e) => {
        setNewNote(e.target.value);
    }
    
    //Publica nueva nota
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const noteToAddToState = {
          content: newNote,
          important: false //Math.random() > 0.5
        }
    
        addNote(noteToAddToState);
        
        //actualiza el estado del input y lo deja vacio
        setNewNote('');
        //cerramos imperativamente el noteform cuando se envia una nota nueva
        toggableRef.current.toggleVisibility();
    }
    
    return (
        <>
            <button onClick={handleLogout} className='logout-btn'>Logout</button>
            <Toggable buttonLabel='Crea una nota' ref={toggableRef}>
                <form onSubmit={handleSubmit} className='crear-nota-form'>
                    <input type='text' onChange={handleChange} value={newNote} placeholder='Escribe una nota' />
                    <button>Crear Nota</button>
                </form>
            </Toggable>
        </>
    )
}