import { useState, useEffect, useCallback } from 'react'

const useToggle = (initialValue = false) => {
  const [state, setState] = useState(initialValue)
  const toggle = useCallback(() => setState((v) => !v), [])
  return [state, toggle, setState]
}

// TODO: how to attach commands to these 'items' (needs a better name!)
const items = [
  { id: 'A', display: 'Insert 🐕' },
  { id: 'B', display: 'Say Hi' },
  { id: 'C', display: 'Delete Text' },
]

export const App = () => {
  const [text, setText] = useState('')
  const [selectedId, setSelectedId] = useState('A')
  const [queryStartIdx, setQueryStartIdx] = useState(0)
  const [runCommand, toggleRunCommand] = useToggle(false)
  const [showMenu, toggleShowMenu, setShowMenu] = useToggle(false)
  const filteredItems = items.filter((item) =>
    item.display.startsWith(text.substring(queryStartIdx))
  )

  // TODO: how to abstract these command functions, so i can easily add more?
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

    // TODO:
    // 1. what if `selectedIdx` is out of bounds for `command`?
    if (selectedIdx !== -1) {
      commands[selectedIdx]()
    }
  }

  const handleTextChange = (e) => {
    const inputText = e.currentTarget.value

    setText(inputText)

    // In 'command-mode', adjust query start position when user hits BACKSPACE.
    if (showMenu && inputText.length < queryStartIdx) {
      setQueryStartIdx(inputText.length)
    }
  }

  const queueRunCommand = () => {
    if (showMenu) {
      // Clear 'command-mode' query text from input field.
      setText((v) => v.substring(0, queryStartIdx))
      // Set 'queue' to run a command. Then, rely on useEffect to run command.
      toggleRunCommand()
    }
  }

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
      case 'ArrowDown':
        if (showMenu) {
          // Prevent arrow keys from repositioning cursor in input field.
          event.preventDefault()
          changeSelectedId(event.key === 'ArrowDown' ? 1 : -1)
        }
        break
      case 'Enter':
        queueRunCommand()
        break
      case '/':
        if (event.metaKey) {
          toggleShowMenu()
          setQueryStartIdx(text.length)
        }
        break
      case 'Escape':
        setShowMenu(false)
        break
      default:
      //noop
    }
  }

  // In 'command-mode', select first command in list as 'text' changes.
  useEffect(() => {
    if (showMenu && filteredItems.length) {
      setSelectedId(filteredItems[0].id)
    }
  }, [text])

  // Reset these state values when not in 'command-mode'.
  useEffect(() => {
    if (!showMenu) {
      setQueryStartIdx(0)
      setSelectedId(items[0].id)
    }
  }, [showMenu])

  // In 'command-mode', run command in 'queue'. Then, reset 'queue' & hide menu.
  useEffect(() => {
    if (showMenu && runCommand) {
      runSelectedCommand()
      toggleShowMenu()
      toggleRunCommand()
    }
  }, [runCommand])

  return (
    <div style={{ margin: '0 auto' }}>
      <div
        style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem',
          }}
        >
          <div
            style={{
              marginBottom: '.5rem',
              color: 'grey',
              fontStyle: 'italic',
              fontSize: '80%',
            }}
          >
            <span>(Use </span>
            <span
              style={{
                padding: '2px 3px',
                marginLeft: '2px',
                marginRight: '2px',
                border: '1px solid grey',
                borderRadius: '.25rem',
              }}
            >
              <kbd>⌘</kbd>
              <kbd>/</kbd>
            </span>
            <span>to toggle command palette) </span>
          </div>
          <input
            type="text"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            style={{
              padding: '.5rem',
              border: '1px solid black',
              borderRadius: '.25rem',
            }}
          />
          {showMenu && (
            <div
              style={{
                marginTop: '1rem',
                padding: '.5rem',
              }}
            >
              {filteredItems.length ? (
                <ul role="listbox" aria-activedescendant={selectedId}>
                  {filteredItems.map((item) => (
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
                      onClick={queueRunCommand}
                    >
                      {item.display}
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ color: 'grey', fontStyle: 'italic' }}>
                  No matches found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
