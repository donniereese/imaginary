import { createContext, useContext, useState } from 'react'

export const StateContainer = createContext()

export const useContainer = () => useContext(StateContainer)

export const rootCause = 'app'

export const Container = ({ children }) => {
  const effects = {
    'request-responses': effect => ({}),
    'default': effect => ({
      list: [],
      loading: false,
    })
  }

  const [containerState, setContainerState] = useState({ ...effects.default() })

  const resolveEffect = async (cause, effect) => {
    const change = effects[cause]
    if (!change) return;

    return setContainerState(change(effect))
  }

  const impact = (cause, shape) => {
    if (effects[cause]) throw new Error(`Cannot have cause "${cause}" when it already exists`)
    if (typeof shape !== 'function') throw new Error(`Cannot have cause "${cause}" with a shape that is not a function`)

    effects[cause] = shape;
  }

  const crush = (newStateObject) => {
    if (!newStateObject) return;
    // TODO finish this crush or export to share with other states
  }

  const ctx = { rootCause, containerState, resolveEffect, impact }

  return (
    <StateContainer.Provider value={ctx}>
      {children}
    </StateContainer.Provider>
  )
}
