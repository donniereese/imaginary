import { createContext, useContext, useState } from 'react'
import { useIpcMessages } from './ipc-messages'

export const HostsContext = createContext()

export const makeHostObject = (host = {}) => ({
  title: host.title ? host.title : '',
  original: host.original ? host.original : '',
  current: host.current ? host.current : '',
  published: host.published ? host.published : false,
  enabled: host.enabled ? host.enabled : false,
})

const makeId = (title = '') => {
  if (title === '') throw new Error('hosts.makeId requires a title of length > 0')
  const tempId = title.replace(/[^\w\d]/gi, '')
  if (title === '') throw new Error('hosts.makeId requires a title of at least 1 or more alphanumeric')
  return tempId;
}

export const HostsProvider = ({ children, sendMessage }) => {
  const [hosts, setHosts] = useState({})

  const { listenToTopic } = useIpcMessages()

  const findHostByTitle = (hostTitle = '') => {
    if (hostTitle === '') return null;
    return hosts[makeId(hostTitle)]
  }

  const addHost = (host) => {
    if (hosts[makeId(host.title)]) {
      // TODO Handle error of host already existing
      return;
    }

    const temp = { ...makeHostObject(host) }
    const tempHosts = { ...hosts }
    tempHosts[makeId(host.title)] = temp

    setHosts(tempHosts)
  }

  const removeHost = (hostId) => {

  }

  const removeAllHosts = () => {

  }

  const messageHandler = (messageTopic, message) => {
    switch (message.type) {
      case 'added-host': {
        let tempHosts = { ...hosts }
        tempHosts[message.id].published = true
        setHosts(tempHosts)
        break;
      }
      default:
        break;
    }
  }

  const ctx = { hosts, addHost, removeHost, removeAllHosts }

  return (
    <HostsContext.Provider value={ctx}>
      {children}
    </HostsContext.Provider>
  )
}
