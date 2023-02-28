require('dotenv').config();
require('./mongo');

const express = require('express'); 
const app = express();
const logger = require('./loggerMiddleware');
const cors = require('cors');
const notFound = require('./middleware/notFound.js');
const handleErrors = require('./middleware/handleErrors');
const usersRouter = require('./controllers/users');
const notesRouter = require('./controllers/notes');
const loginRouter = require('./controllers/login');
const testingRouter = require('./controllers/testing');

app.use(cors());
app.use(express.json());
app.use(logger); 
app.use(express.static('../app/build'));

//Routers
//controller endpoints login
app.use('/api/login', loginRouter);

//controller endpoints users
app.use('/api/users', usersRouter);

//controller endpoints notes
app.use('/api/notes', notesRouter);


if(process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter);
}

app.use(notFound);

app.use(handleErrors);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = {app, server};