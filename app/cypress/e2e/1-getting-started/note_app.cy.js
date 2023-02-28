/*global cy*/

describe('Note App', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');

        cy.request('POST', 'http://localhost:3001/api/testing/reset');

        const user = {
            name: 'Javiera',
            username: 'Javiera',
            password: 'midupassword'
        }

        cy.request('POST', 'http://localhost:3001/api/users', user);
    })

    it('frontpage can be opened', () => {
        cy.contains('Notas');
    })

    it('login form can be opened', () => {
        cy.contains('Mostrar Login').click();
    })

    it('login fails with wrong password', () => {
        cy.contains('Mostrar Login').click();
        cy.get('[placeholder="Usuario"]').type('Javiera');
        cy.get('[placeholder="Contraseña"]').type('wrongpassword');
        cy.get('#login-button').click();
        cy.contains('Credenciales Invalidas');
    })

    it('user can login', () => {
        cy.contains('Mostrar Login').click();
        cy.get('[placeholder="Usuario"]').type('Javiera');
        cy.get('[placeholder="Contraseña"]').type('midupassword');
        cy.get('#login-button').click();
        cy.contains('Crea una nota');
    })

    describe('when logged in', () => {
        beforeEach(() => {
            cy.login({username: 'Javiera', password: 'midupassword'})
        })

        it('user can create a new note', () => {
            cy.contains('Crea una nota').click();
            cy.get('input').type('Testing to create a note with cypress');
            cy.contains('Crear Nota').click();
            cy.contains('Testing to create a note with cypress');
        })

        describe('and a note exists', () => {
            beforeEach(()=>{
                cy.createNote({content: 'Another note created from Cypress from commands', important: false});

                cy.createNote({content: '2 Another note created from Cypress from commands', important: false});


                cy.createNote({content: '3Another note created from Cypress from commands', important: false});

            })

            it('it can be made important', () => {
                cy.get('li').first().as('theNote').contains('Another note created from Cypress from commands')
                    
                cy.get('@theNote')
                    .contains('Hacer importante')
                    .click()

                cy.get('@theNote')
                    .contains('Hacer no importante')
            })
        })
    })
})