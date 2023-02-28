const notesRouter = require('express').Router();
const Note = require('../models/Note');
const User = require('../models/User');
const userExtractor = require('../middleware/userExtractor');

notesRouter.get('/', (request, response) => {
    Note.find({}).populate('user', {
        username: 1,
        name: 1
    })
        .then(notes => {
            response.json(notes);
        });
});

notesRouter.get('/:id', (request, response, next) => {
    const {id} = request.params;
    
    Note.findById(id).then(note => {
        if (note) {
            response.json(note);
        } else {
            response.status(404).end();
        }
    }).catch(err => {
        next(err);
    });
});

notesRouter.put('/:id', userExtractor, (request, response) => {
    const {id} = request.params;
    const note = request.body;

    const newNoteInfo = {
        content: note.content,
        important: note.important
    };

    Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
        .then(result => {
            response.json(result);
        });

});

notesRouter.delete('/:id', userExtractor, (request, response, next) => {
    const {id} = request.params;
    
    Note.findByIdAndRemove(id).then(response => {
        response.status(204).end();
    }).catch(err => next(err));

    response.status(204).end();

});

notesRouter.post('/', userExtractor, async (request, response, next) => {
    const {
        content, 
        important = false
    } = request.body;

    //sacar userId de request
    const {userId} = request;

    const user = await User.findById(userId);

    if (!content) {
        return response.status(400).json({
            error: 'required "content" field is missing' 
        });
    }

    const newNote = new Note({
        content,
        important,
        date: new Date().toISOString(),
        user: user._id
    });

    try {
        const savedNote = await newNote.save();
        
        user.notes = user.notes.concat(savedNote._id);
        await user.save();
        
        response.status(201).json(savedNote);
    } catch (error) {
        next(error);
    }
});

module.exports = notesRouter;