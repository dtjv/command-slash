import { useState, useCallback } from 'react'

export const useToggle = (initialValue = false) => {
  const [state, setState] = useState(initialValue)
  const toggle = useCallback(() => setState((v) => !v), [])

  return [state, toggle, setState]
}
