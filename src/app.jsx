import { useState } from 'react'

const DEFAULT_ITEMS = [{ id: 'A' }, { id: 'B' }, { id: 'C' }]

export const App = () => {
  const [text, setText] = useState('')
  const [items, setItems] = useState(DEFAULT_ITEMS)
  const [selectedId, setSelectedId] = useState('A')

  const handleChange = (e) => {
    const v = e.currentTarget.value
    setText(v)
  }

  const handleMouseOver = (id) => {
    setSelectedId(id)
  }

  const handleKeyDown = (e) => {
    const selectedIdx = items.findIndex((item) => item.id === selectedId)
    const offset = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0

    if (offset !== 0) {
      e.preventDefault()

      let nextIdx = selectedIdx + offset
      nextIdx =
        nextIdx < 0 ? 0 : nextIdx === items.length ? nextIdx - 1 : nextIdx
      setSelectedId(items[nextIdx].id)
    }
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
                  {item.id}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
