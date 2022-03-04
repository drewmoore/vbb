import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// fun looking api to use: https://v5.vbb.transport.rest/api.html

// Debugging:
// browser error: Uncaught ReferenceError: define is not defined
// seems maybe webpack is still needed, even with ts
// https://dev.to/riddhiagrawal001/create-react-app-without-create-react-app-typescript-5ea2

console.log('hello')

ReactDOM.render(<App />, document.getElementById('root'));
