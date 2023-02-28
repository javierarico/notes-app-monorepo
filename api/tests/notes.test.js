const mongoose = require('mongoose');
const {server} = require ('../index.js');
const Note = require('../models/Note');
const {api, initialNotes, getAllContentFromNotes} = require('./helpers');


beforeEach(async () => {
    //borra todas las notas
    await Note.deleteMany({});
    //crea nuevas notas para que el test pase siempre, independientemente de la base de datos
    for (const note of initialNotes) {
        const noteObject = new Note(note);
        await noteObject.save();
    }
});

test('notes are returned as json', async () => {
    await api
        .get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/);
});

test('there are two notes', async () => {
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(initialNotes.length);
});

test('one note contains midudev', async () => {
    const {contents} = await getAllContentFromNotes();
    expect(contents).toContain('Aprendiendo FullStack JS con midudev');
});

test('a valid note can be added', async () => {
    const newNote = {
        content: 'proximamente async/await',
        important: true
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(201)
        .expect('Content-Type', /application\/json/);

    const {contents, response} = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length + 1);
    expect(contents).toContain(newNote.content);
});

test('note without content cant be added', async () => {
    const newNote = {
        important: true
    };

    await api
        .post('/api/notes')
        .send(newNote)
        .expect(400);

    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(initialNotes.length);
});

test('a note can be deleted', async () => {
    const {response: firstResponse} = await getAllContentFromNotes();
    const {body: notes} = firstResponse;
    const noteToDelete = notes[0];

    await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204);

    const {contents, response: secondResponse} = await getAllContentFromNotes();
    expect(secondResponse.body).toHaveLength(initialNotes.length - 1);
    expect(contents).not.toContain(noteToDelete.content);
});

test('a note that do not exist can not be deleted', async () => {
    await api
        .delete('/api/notes/1234')
        .expect(204);

    const {response} = await getAllContentFromNotes();
    expect(response.body).toHaveLength(initialNotes.length);
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});