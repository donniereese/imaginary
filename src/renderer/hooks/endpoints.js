import { createContext, useContext, useState } from 'react'
import { useIpcMessages } from './ipc-messages'
import { useFlog } from './flog'

export const EndpointsContext = createContext()

export const useEndpoints = () => useContext(EndpointsContext)

export const EndpointsProvider = ({ children, sendMessage }) => {
  const { log, level } = useFlog()

  const [endpoints, setEndpoints] = useState({})

  const makeEndpointObject = (ep) => {
    return {
      name: '',
      endpoint: ep,
      published: false,
      responseIdent: null,
      customResponse: null,
      enabled: false,
    }
  }

  const addEndpoint = (epObject = {}, shouldPublish = false) => {
    leve('addEndpoint()')
    console.log('(hook) addEndpoint')

    let ident = epObject.name
    ident = ident.replace(/[^\w\d]/gi, '')

    let tempEndpoints = { ...endpoints }
    tempEndpoints[ident] = { ...epObject, published: shouldPublish ? true : false }
    setEndpoints({ ...tempEndpoints })

    console.log(`(hook) shouldPublish: ${shouldPublish}`)

    if (shouldPublish) sendMessage('add-endpoint', epObject)
  }

  const removeEndpoint = (epIdent) => {

  }

  const modifyEndpoint = (currentEpIdent, nextEpIdent) => {

  }

  const pauseEndpoint = (epIdent) => {

  }

  const markPublished = (epId) => {
    let tempEndpoints = { ...endpoints }
    tempEndpoints[epId].published = true;
    setEndpoints(tempEndpoints)
  }

  const ctx = {
    endpoints,
    addEndpoint,
    removeEndpoint,
    modifyEndpoint,
    pauseEndpoint,
    makeEndpointObject,
  }

  return (
    <EndpointsContext.Provider value={ctx}>
      {children}
    </EndpointsContext.Provider>
  )
}
