import axios from 'axios';

const baseUrl = '/api/notes';

let token = null;

const setToken = newToken => {
    token = `Bearer ${newToken}`
}

const getAllNotes = () => {
    const request = axios.get(baseUrl)
    /*const nonExisting = {
        id: 10000,
        content: 'This note is not saved to server',
        date: '2019-05-30T17:30:31.098Z',
        important: true,
    }*/
    //return request.then(response => response.data.concat(nonExisting));
    return request.then(response => response.data)
}

const createNote = (newObject) => {
    const config = {
        headers: {
            Authorization: token
        }
    }
    const request = axios.post(baseUrl, newObject, config);
    return request.then(response => response.data);
}

const updateNote = (id, newObject) => {
    const config = {
        headers: {
            Authorization: token
        }
    }
    const request = axios.put(`${baseUrl}/${id}`, newObject, config);
    return request.then(response => response.data);
}

const notes = { getAllNotes, createNote, updateNote, setToken }

export default notes