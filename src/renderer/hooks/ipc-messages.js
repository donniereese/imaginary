import { createContext, useContext, useState } from 'react'

export const IpcContext = createContext()

export const useIpcMessages = () => useContext(IpcContext)

export const makeTopicObject = (listener) => ({
  log: [],
  listening: true,
  listener: listener,
})

export const IpcMessages = ({ ipcrenderer, defaultTopics = [], children }) => {
  const tempTopics = {}
  if (defaultTopics.length > 0) {
    defaultTopics.forEach((topic) => {
      const tempListener = ipcRenderer.on(topic, (m) => messageHandler(topic, m))

      tempTopics[topic] = {
        log: [],
        listening: true,
        listener: tempListener,
      }
    })
  }

  const [topics, setTopics] = useState({ ...tempTopics })
  const [topicListeners, setTopicListener] = useState({})
  const [topicResolvers, setTopicResolvers] = useState({})
  const [logs, setLogs] = useState([])

  const resolver = (current, action) => {

  }

  const makeLog = (title, message, timestamp) => ({
    title: `${title}`,
    message: `${message}`,
    timestamp: timestamp ? timestamp : Date.now(),
  })

  const log = (title = 'Unknown Log', message = '') => {
    setLogs([...logs, makeLog(title, message)])
  }

  const addTopic = (topic) => {
    if (!Object.entries(topics).includes(topics)) {
      const temp = { ...topics }
      temp[topic] = {
        ...makeTopicObject(ipcRenderer.on(topic, (m) => messageHandler(topic, m))),
      }

      setTopics({ ...temp })
    }
  }

  const listenToTopic = (topic, listener = () => { }) => {
    if (!topic) return;
    if (!topics[topic]) addTopic(topic)
    if (!topicListeners[topic]) topicListeners[topic] = []
    topicListeners[topic].push(listener)
  }

  const silenceTopic = (topic) => {

  }

  const messageHandler = (messageTopic, message) => {
    console.log('(hooks) ipc-message > messageHandler() ', messageTopic, message)
    // Get Topic
    let topicRes = topicResolvers[messageTopic]
    let topicObj = topics[messageTopic]
    let newTopics = { ...topics }

    if (Array.isArray(topicRes))
      if (!topicObj) throw new Error(`(hooks) ipc-messages > nessageHandler - topics["${messageTopic}"] does not exist`)
    if (message.resolvable) {
      // TODO Handle resolvable
    }

    newTopics[messageTopic] = { ...topicObj, log: [...topicObj.log, message] }

    setTopics(newTopics)
    setLogs([...logs, makeLog(messageTopic, message)])

    if (topicListeners[topic]) {
      for (let i = 0; i < topicListeners[topic].length; i++) {
        topicListeners[topic][i](messageTopic, message)
      }
    }
  }

  const ctx = { topics, addTopic, listenToTopic, silenceTopic, logs, setLogs }

  return (
    <IpcContext.Provider value={ctx}>
      {children}
    </IpcContext.Provider>
  )
}
