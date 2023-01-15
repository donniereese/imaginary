import { createContext, useContext, useState } from 'react'

export const StateContainer = createContext()

export const useContainer = () => useContext(StateContainer)

export const rootCause = 'app'

export const Container = ({ children }) => {
  const effects = {
    'request-endpoints' : effect => ({ loading: true }),
    'endpoints-loaded'  : effect => ({ list: effect.list }),
    'submit-request'    : effect => ({ server: { ...containerState.server, polled: effect.polled, polling: false } }),
    'request-received'  : effect => ({ server: { ...containerState.server, polling: true } }),
    'default': () => ({
      list: [],
      loading: false,
      editor: {
        endpointId: null,
        saving: false,
        saved: null,
        form: {
          name: '',
          endpoint: '',
          responseType: null,
          responseId: null,
          responseBody: null,
          responseType: 'Plain Text',
          public: false,
        },
      },
    }),
  }
  console.log('Effects: ', effects)
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

    // TODO Finish crush
  }

  const ctx = { rootCause, containerState, resolveEffect, impact }

  return (
    <StateContainer.Provider value={ctx}>
      {children}
    </StateContainer.Provider>
  )
}
