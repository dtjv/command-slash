import { useState } from 'react'

const DEFAULT_ITEMS = [
  { id: 'A', display: 'Insert 🐕' },
  { id: 'B', display: 'Say Hi' },
  { id: 'C', display: 'Delete Text' },
]

export const App = () => {
  const [text, setText] = useState('')
  const [items, setItems] = useState(DEFAULT_ITEMS)
  const [showMenu, setShowMenu] = useState(false)
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

  const handleChangeSelected = (event) => {
    event.preventDefault()

    const selectedIdx = items.findIndex((item) => item.id === selectedId)
    const offset = event.key === 'ArrowDown' ? 1 : -1

    if (selectedIdx !== -1) {
      let nextIdx = selectedIdx + offset
      nextIdx =
        nextIdx < 0 ? 0 : nextIdx === items.length ? nextIdx - 1 : nextIdx

      setSelectedId(items[nextIdx].id)
    }
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        if (showMenu) {
          handleChangeSelected(event)
        }
        break
      case 'Enter':
        if (showMenu) {
          const selectedIdx = items.findIndex((item) => item.id === selectedId)
          if (selectedIdx !== -1) {
            setText((text) => text.substring(0, text.length - 1))
            commands[selectedIdx]()
            setShowMenu(false)
          }
        }
        break
      case '/':
        setShowMenu(true)
      default:
      // noop
    }
  }

  const handleChange = (e) => {
    const inputValue = e.currentTarget.value
    setText(inputValue)

    if (inputValue === '') {
      setSelectedId(0)
    }
  }

  const handleMouseOver = (id) => {
    setSelectedId(id)
  }

  return (
    <div style={{ margin: '0 auto' }}>
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
      >
        <div>
          <input
            type="text"
            value={text}
            onChange={handleChange}
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
                    onMouseOver={() => handleMouseOver(item.id)}
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
