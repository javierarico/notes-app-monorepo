const User = require('../models/User');
const bcrypt = require('bcrypt');
const {api, getAllUsers} = require('./helpers');
const mongoose = require('mongoose');
const {server} = require ('../index.js');

describe.only('creating a new user', () => {
    beforeEach(async () => {
        //primero eliminamos todos los usuarios
        await User.deleteMany();

        //creamos un nuevo usuario
        const passwordHash = await bcrypt.hash('pswd', 10);
        const user = new User({
            username: 'midutest',
            passwordHash
        });
        await user.save();
    });

    test('works as expected creating a fresh username', async () => {
        //primero recuperamos todos los usuarios de la bd
        const usersAtStart = await getAllUsers();

        const newUser = {
            username: 'newuser',
            name: 'user',
            password: 'userpassword'
        };

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await getAllUsers();
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        expect(usernames).toContain(newUser.username);
    });

    test('creation fails with proper statuscode and message if username is already taken', async () => {
        const usersAtStart = await getAllUsers();

        const newUser = {
            username: 'midutest',
            name: 'another name',
            password: 'anoterPass'
        };

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);
        
        expect(result.body.errors.username.message).toContain('`username` to be unique');

        const usersAtEnd = await getAllUsers();
        expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
});

afterAll(() => {
    mongoose.connection.close();
    server.close();
});