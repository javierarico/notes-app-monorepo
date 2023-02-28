import './index.css';
import { useState, useEffect } from 'react';
import {Note} from './components/Note.js';
import Notification from './components/Notification';
import loginService from './services/login';
import noteService from './services/notes';
import LoginForm from './components/LoginForm';
import NoteForm from './components/NoteForm';

export default function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showNotesBtn, setshowNotesBtn] = useState(false);
  const [importantNoteBtn, setImportantNoteBtn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  //estados para el formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  //recupera las notas de la API
  //re renderiza cada vez que se cambia el estado important de la nota
  //axios get
  useEffect(() => {
    setLoading(true);
    noteService.getAllNotes()
      .then(notes => {
        setNotes(notes);
        setLoading(false);
        notes.map(note => setImportantNoteBtn(note.important))
      }).catch(e => {
        console.error(e);
      })
  }, [importantNoteBtn])

  //controla el localStorage
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, [])

  //para hacer logout
  const handleLogout = () => {
    setUser(null);
    noteService.setToken(null);
    window.localStorage.removeItem('loggedNoteAppUser');
  }

  //Publica nueva nota
  const addNote = (noteToAddToState) => {
    //axios post
    noteService.createNote(noteToAddToState)
      .then((newNote) => {
        setNotes((prevNotes) => prevNotes.concat(newNote))
      }).catch(e => {
        console.error(e);
      })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('THIS IS SUBMIT');
    try {
      console.log('try')
      const user = await loginService.login({
        username,
        password
      })
      
      console.log(user);

      //guardamos la sesion en el localStorage
      window.localStorage.setItem(
        'loggedNoteAppUser', JSON.stringify(user)
      )

      noteService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch(error) {
      console.log(error);
      setErrorMessage('Credenciales Invalidas');
      //luego de 5 seg el error y lo escrito en el input desaparecen.
      setTimeout(() => {
        setErrorMessage(null);
        setUsername('');
        setPassword('');
      }, 5000)
    }
  }

  //modifica el important de la nota
  const handleImportantNote = (id, important) => {
    /*console.log(importantNoteBtn);
    console.log(id);
    console.log(important);*/

    //cambiamos el estado para que re renderice cada vez que cambia el estado important de la nota
    setImportantNoteBtn(!importantNoteBtn);
    //actualizamos el valor important de la nota en el server
    noteService.updateNote(id, {important: !important});
  }

  //handles notes to show
  const notesToShow = showNotesBtn 
    ? notes.filter(note => note.important)
    : notes;

  return (
    <div className='notes-container'>
      <h1>Clase 16 del Bootcamp Full Stack</h1>
      <h2>Notas</h2>
      <Notification message={errorMessage}/>

      {
        user 
          ? <NoteForm 
              addNote={addNote}
              handleLogout={handleLogout}
            />
          : <LoginForm 
              username={username} 
              password={password} 
              handleUsernameChange={({target}) => setUsername(target.value)} 
              handlePasswordChange={({target}) => setPassword(target.value)} 
              handleLoginSubmit={handleLoginSubmit} 
            />
      }

      {
        loading ? 'Cargando...' : ''
      }
      <br/><br/>
      <button onClick={() => setshowNotesBtn(!showNotesBtn)} className='show-notes-btn'>
        {showNotesBtn ? 'Ver todas las notas' : 'Ver notas importantes'}
      </button>
      <ul className='list-notes-container'>
        {
          notesToShow
            .map((note) => <Note key={note.id} isImportant={note.important} handleImportantNote={()=>{handleImportantNote(note.id, note.important)}} {...note} />)
        }
      </ul>
    </div>
  )
}