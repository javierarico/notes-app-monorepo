const supertest = require('supertest');
const {app} = require ('../index.js');
const User = require('../models/User');

const api = supertest(app);


const initialNotes = [
    {
        content: 'Aprendiendo FullStack JS con midudev',
        important: true,
        date: new Date()
    },
    {
        content: 'Seguir a midudev',
        important: true,
        date: new Date()
    }
];

const getAllContentFromNotes = async () => {
    const response = await api.get('/api/notes');
    return {
        contents: response.body.map(note => note.content),
        response
    };
};

const getAllUsers = async () => {
    //primero recuperamos todos los usuarios de la bd
    const usersDB = await User.find({});
    return usersDB.map(user => user.toJSON());
};

module.exports = {api, initialNotes, getAllContentFromNotes, getAllUsers};