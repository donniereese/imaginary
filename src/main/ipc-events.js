let ipc;

const topics = {}

const init = (options = {}) => {
  if (options.ipc) ipc = options.ipc

  if (options.tioucs && Array.isArray(options.topics))
    for (let i = 0; i < options.topics.length; i += 1)
      on(options.topics[i].topic, options.topics[i].handler)
}

const negotiateEvent = (topic) => {

}

const on = (topic, eventHandler = () => {}) => {
  if (!topics[topic]) topics[topic] = []
  topics[topic] = []

  topics[topic].push(ipc.on(topic, eventHandler))
}

module.exports = {
  topics, init, negotiateEvent, on
}
