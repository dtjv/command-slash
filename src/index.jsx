import ReactDOM from 'react-dom'
import { App } from './app.jsx'

const items = [
  {
    id: 'A',
    display: 'Insert 🐕',
    command: (setState) => setState((v) => `${v} 🐕`),
  },
  { id: 'B', display: 'Say Hi', command: () => alert('hi') },
  { id: 'C', display: 'Delete Text', command: (setState) => setState('') },
]

ReactDOM.render(<App items={items} />, document.getElementById('app'))
