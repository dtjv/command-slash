import { useState, useEffect, useCallback } from 'react'

const useToggle = (initialValue = false) => {
  const [state, setState] = useState(initialValue)
  const toggle = useCallback(() => setState((v) => !v), [])
  return [state, toggle, setState]
}

const items = [
  { id: 'A', display: 'Insert 🐕' },
  { id: 'B', display: 'Say Hi' },
  { id: 'C', display: 'Delete Text' },
]

export const App = () => {
  const [text, setText] = useState('')
  const [showMenu, toggleMenu, setShowMenu] = useToggle(false)
  const [selectedId, setSelectedId] = useState('A')

  const insertDog = () => {
    setText((text) => `${text} 🐕`)
  }

  const deleteText = () => {
    setText('')
  }

  const sayHi = () => {
    alert('hi!')
  }

  const commands = [insertDog, sayHi, deleteText]

  const changeSelectedId = (offset) => {
    const selectedIdx = items.findIndex((item) => item.id === selectedId)

    if (selectedIdx !== -1) {
      let nextIdx = selectedIdx + offset
      nextIdx =
        nextIdx < 0 ? 0 : nextIdx === items.length ? nextIdx - 1 : nextIdx

      setSelectedId(items[nextIdx].id)
    }
  }

  const runSelectedCommand = () => {
    const selectedIdx = items.findIndex((item) => item.id === selectedId)

    if (selectedIdx !== -1) {
      commands[selectedIdx]()

      setSelectedId(items[0].id)
      toggleMenu()
    }
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        if (showMenu) {
          event.preventDefault()
          changeSelectedId(event.key === 'ArrowDown' ? 1 : -1)
        }
        break
      case 'Enter':
        if (showMenu) {
          runSelectedCommand()
        }
        break
      case '/':
        if (event.metaKey) {
          toggleMenu()
        }
        break
      case 'Escape':
        setShowMenu(false)
        break
      default:
      //noop
    }
  }

  useEffect(() => {
    if (text === '') {
      setShowMenu(false)
      setSelectedId(items[0].id)
    }
  }, [text])

  return (
    <div style={{ margin: '0 auto' }}>
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
      >
        <div>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.currentTarget.value)}
            onKeyDown={handleKeyDown}
            style={{ padding: '.5rem', border: '1px solid black' }}
          />
          {showMenu && (
            <div
              style={{
                marginTop: '1rem',
                padding: '.5rem',
              }}
            >
              <ul role="listbox" aria-activedescendant={selectedId}>
                {items.map((item) => (
                  <li
                    key={item.id}
                    id={item.id}
                    role="option"
                    aria-selected={selectedId === item.id}
                    style={{
                      ...{
                        cursor: 'pointer',
                        margin: '.5rem',
                        padding: '.5rem',
                        backgroundColor: '#eee',
                      },
                      ...(selectedId === item.id
                        ? { backgroundColor: 'lightblue' }
                        : { backgroundColor: '#eee' }),
                    }}
                    onMouseOver={() => setSelectedId(item.id)}
                    onClick={runSelectedCommand}
                  >
                    {item.display}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
