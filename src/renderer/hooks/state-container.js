import { createContext, useContext, useState } from 'react'
import ArrayTree from '../components/containers/array-tree'

export const StateContainer = createContext()

export const useAppState = () => useContext(StateContainer)

export const AppState = ({
  defaultState = {},
  defaultEffects = {},
  containers,
  iKnowWhatIAmDoing,
  stopNaggingMe,
  children,
}) => {
  const [appState, setAppState] = useState({ ...defaultState })
  const [effects, setEffects] = useState({ ...defaultEffects })

  const resolveEffect = async (resolveEffect, resolvable = {}) => {
    if (!resolveEffect) throw new Error('You forgot to provide an effect to resolve')
    if (!resolvable) console.warn('You forgot to provide a resolvable for the effect, default is an empty object')

    const effect = effects[resolveEffect]
    if (!effect) {
      console.warn(`No effect was found to resolve "${resolveEffect}"`)
      return false;
    }

    let change;

    if (typeof resolvable === 'function') {
      const temp = await resolvable()
    } else {
      change = effect(appState, appState)
    }

    if (!change) return false;

    setAppState({ ...appState, ...change })

    return true;
  }

  const effect = (event, payload) => {
    const handler = null;
  }

  const affect = (effect) => {

  }

  const resolveAnonymousEffect = async (effect) => {
    if (!iKnownWhatIAmDoing) throw new Error('You might not know what you are doing, that\'s okay')
    if (typeof effect !== 'function') throw new Error('Anonymous Effect must be a function')
    if (!stopNaggingMe) console.warn('Wrecklessly using resolveAnonymousEffect; You live dangerously and I love it for you!')

    const tempState = effect(appState)
    setAppState({ ...tempState })
  }

  const divineCauseAndEffect = () => {

  }

  const ctx = { appState, resolveAnonymousEffect, resolveEffect, effect }

  return (
    <StateContainer.Provider value={ctx}>
      <ArrayTree containers={containers}>
        {children}
      </ArrayTree>
    </StateContainer.Provider>
  )
}
