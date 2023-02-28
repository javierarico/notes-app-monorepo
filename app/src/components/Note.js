//import {updateNote} from '../services/notes';


export const Note = ({ content, isImportant, handleImportantNote }) => {
  return (
    <li className='note-container'>
      <p>{content}</p>
      <button onClick={handleImportantNote}>{ isImportant ? 'Hacer no importante' : 'Hacer importante' /*importantNote ? 'make not important' : 'make important'*/}</button>
    </li>
  )
}