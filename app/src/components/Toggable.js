import React, {forwardRef, useImperativeHandle, useState} from 'react';
import PropTypes from 'prop-types';

const Toggable = forwardRef(({children, buttonLabel}, ref) => {
    const [visible, setVisible] = useState(false);
    
    const hideWhenVisible = { display: visible ? 'none' : '' };
    const showWhenVisible = { display: visible ? '' : 'none' };

    const toggleVisibility = () => setVisible(!visible);

    useImperativeHandle(ref, () => {
        return {
            toggleVisibility
        }
    })

    return (
        <div>
            <div style={hideWhenVisible}>
                <button className='show-login' onClick={toggleVisibility}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible} className='login-container'>
                {children}
                <button className='cancel-login' onClick={toggleVisibility}>Cancelar</button>
            </div>

        </div>   
    )
}) 

Toggable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
}

export default Toggable;