import { createContext, useContext, useContext, useState } from 'react'

export const ResponsesContext = createContext()

export const useResponses = () => useContext(ResponsesContext)

export const ResponsesProvider = ({ children }) => {
  const [responses, setResponses] = useState({
    default: {
      name: 'Default',
      response: `{ 'key': 'value' }`,
      type: 'json',
      published: false,
    }
  })

  const makeResponseObject = () => ({
    name: null,
    response: '',
    type: 'json',
    published: false,
  })

  const addResponse = (epIdent) => {

  }

  const removeResponse = (currentEpIdent, nextIpIdent) => {

  }

  const modifyResponse = (currentEpIdent, nextEpIdent) => {

  }

  const pauseResponse = (epIdent) => {

  }

  const ctx = { responses, addResponse, removeResponse, modifyResponse, pauseResponse, makeResponseObject }

  return (
    <ResponsesContext.Provider value={ctx}>
      {children}
    </ResponsesContext.Provider>
  )
}
