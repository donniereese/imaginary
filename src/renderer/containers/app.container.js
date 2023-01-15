import { createContext, useContext, useState } from 'react'

export const StateContainer = createContext()

export const useContainer = () => useContext(StateContainer)

export const rootCause = 'app'

export const Container = ({ children }) => {
  const effects = {
    'server-status': effect => ({ server: { ...containerState.server, status: effect.status } }),
    'server-polled': effect => ({ server: { ...containerState.server, polled: effect.polled, polling: false } }),
    'server-poll': effect => ({ server: { ...containerState.server, polling: true } }),
    'default': () => ({
      server: {
        status: '',
        polled: null,
        polling: false,
      }
    }),
  }

  const [containerState, setContainerState] = useState()

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

  const ctx = { rootCause, containerState, resolveEffect, impact }

  return (
    <StateContainer.Provider value={ctx}>
      {children}
    </StateContainer.Provider>
  )
}
