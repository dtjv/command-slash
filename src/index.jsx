import ReactDOM from 'react-dom'
import { App } from './app.jsx'

/*
 * Notes:
 * 1. The `command` property is a function that is passed the input text field's
 *    setState function (from `useState` hook).
 */
const commands = [
  {
    id: 'A',
    display: 'Insert 🎃',
    command: (setState) => setState((v) => `${v} 🎃`),
  },
  { id: 'B', display: 'Say Hi', command: () => alert('hi') },
  { id: 'C', display: 'Delete Text', command: (setState) => setState('') },
]

ReactDOM.render(<App commands={commands} />, document.getElementById('app'))
