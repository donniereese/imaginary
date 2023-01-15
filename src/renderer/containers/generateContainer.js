import { createContext, useContext, useState } from 'react'
import * as util from '../util'

export const containerState = (causeName = '', effects) => {
  if (!util.isStringValue(causeName))
    throw new Error('(state) Cannot create state container with empty cause')
  if (!effects || !effects.default)
    throw new Error('(state) Must provide propper effects object to create state container')

  const rootCause = causeName

  const StateContainer = createContext()
  const useContainer = () => useContext(StateContainer)

  const Container = ({ children }) => {
    const effects = {
      'default': {

      }
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

  return {
    rootCause,
    StateContaner,
    useContainer,
    Container,
  }
}
