import React from 'react';
import Toggable from './Toggable';
import PropTypes from 'prop-types';

export default function LoginForm (props) {
    return (
        <Toggable buttonLabel='Mostrar Login'>
            <form onSubmit={props.handleLoginSubmit} className='form-container'>
                <h4>Inicia sesion para editar o crear una nota</h4>
                <div>
                    <input
                        type='text'
                        value={props.username}
                        name='Username'
                        placeholder='Usuario'
                        onChange={props.handleUsernameChange}
                    />
                </div>
                <div>
                    <input
                        type='password'
                        value={props.password}
                        name='Password'
                        placeholder='Contraseña'
                        onChange={props.handlePasswordChange}
                    />
                </div>
                <button id='login-button'>Login</button>
            </form>
        </Toggable>
    )
}

LoginForm.propTypes = {
    handleLoginSubmit: PropTypes.func.isRequired,
    username: PropTypes.string.isRequired,
    
}