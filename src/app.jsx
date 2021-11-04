import { useRef, useState, useEffect } from 'react'
import { useToggle } from './use-toggle'

// Notes:
// 1. 'command mode' references the app state when the command menu is showing.
export const App = ({ commands }) => {
  const inputRef = useRef()
  const [text, setText] = useState('')
  const [selectedId, setSelectedId] = useState(commands[0].id)
  const [queryStartIdx, setQueryStartIdx] = useState(0)
  const [runCommand, toggleRunCommand] = useToggle(false)
  const [showMenu, toggleShowMenu, setShowMenu] = useToggle(false)
  const filteredCommands = commands.filter((command) =>
    command.display.startsWith(text.substring(queryStartIdx))
  )

  const changeSelectedId = (offset) => {
    const selectedIdx = commands.findIndex(
      (command) => command.id === selectedId
    )

    if (selectedIdx !== -1) {
      let nextIdx = selectedIdx + offset
      nextIdx =
        nextIdx < 0 ? 0 : nextIdx === commands.length ? nextIdx - 1 : nextIdx

      setSelectedId(commands[nextIdx].id)
    }
  }

  const runSelectedCommand = () => {
    const selectedItem = commands.find((command) => command.id === selectedId)

    if (selectedItem) {
      selectedItem.command(setText)
      inputRef.current.focus()
    }
  }

  const queueRunCommand = () => {
    if (showMenu) {
      // Clear 'command mode' query text from input field.
      setText((v) => v.substring(0, queryStartIdx))
      // Set 'queue' to run a command. Then, rely on useEffect to run command.
      toggleRunCommand()
    }
  }

  const handleTextChange = (event) => {
    const inputText = event.currentTarget.value

    setText(inputText)

    // In 'command mode', adjust query start position when user hits BACKSPACE.
    if (showMenu && inputText.length < queryStartIdx) {
      setQueryStartIdx(inputText.length)
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
        // The `metaKey` is the `⌘` (cmd) key.
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

  // In 'command mode', select first command in list as 'text' changes.
  useEffect(() => {
    if (showMenu && filteredCommands.length) {
      setSelectedId(filteredCommands[0].id)
    }
  }, [text])

  // Reset these state values when not in 'command mode'.
  useEffect(() => {
    if (!showMenu) {
      setQueryStartIdx(0)
      setSelectedId(commands[0].id)
    }
  }, [showMenu])

  // In 'command mode', run command in 'queue'. Then, reset 'queue' & hide menu.
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
          <h1
            style={{
              fontWeight: '800',
              fontSize: '2rem',
              marginBottom: '.5rem',
            }}
          >
            Command Slash
          </h1>
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
            ref={inputRef}
            type="text"
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            style={{
              padding: '.5rem',
              border: '1px solid black',
              borderRadius: '.25rem',
            }}
            autoFocus
          />
          {showMenu && (
            <div
              style={{
                marginTop: '1rem',
                padding: '.5rem',
              }}
            >
              {filteredCommands.length ? (
                <ul role="listbox" aria-activedescendant={selectedId}>
                  {filteredCommands.map((command) => (
                    <li
                      key={command.id}
                      id={command.id}
                      role="option"
                      aria-selected={selectedId === command.id}
                      style={{
                        ...{
                          cursor: 'pointer',
                          margin: '.5rem',
                          padding: '.5rem',
                          backgroundColor: '#eee',
                        },
                        ...(selectedId === command.id
                          ? { backgroundColor: 'lightblue' }
                          : { backgroundColor: '#eee' }),
                      }}
                      onMouseOver={() => setSelectedId(command.id)}
                      onClick={queueRunCommand}
                    >
                      {command.display}
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
