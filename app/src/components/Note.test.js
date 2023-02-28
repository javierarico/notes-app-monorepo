import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {prettyDOM} from '@testing-library/dom';
import { fireEvent, render } from '@testing-library/react';
import {Note} from './Note';

test('renders content', () => {
    const note = {
        content: 'This is a test',
        important: true
    };

    const component = render(<Note content={note.content} isImportant={note.important} />);

    //console.log(component);
    //component.getByText('This is a test');
    component.getByText('Hacer no importante');
    expect(component.container).toHaveTextContent(note.content);
    //component.debug()
    //const li = component.container.querySelector('li');
    //console.log(prettyDOM(li));
});

test('clicking the button calls event handler once', () => {
    const note = {
        content: 'This is a test',
        important: true
    };

    const mockHandler = jest.fn();

    const component = render(<Note content={note.content} isImportant={note.important} handleImportantNote={mockHandler} />);

    const button = component.getByText('Hacer no importante');
    fireEvent.click(button);

    expect(mockHandler.mock.calls).toHaveLength(1);
});