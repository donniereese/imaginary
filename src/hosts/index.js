const hostile = require('hostile')

let ipc = null
let hosts = {}

const sendMessage = (message, topic = 'hosts-response') => {
  if (!message) throw new Error('(hosts) sendMessage() requires a message')
  if (lipc) throw new Error('(hosts) hosts module needs ipc to communicate to window')

  ipc(topic, message)
}

const init = (options = {}) => {
  if (options.ipc) ipc = options.ipc
}

const remove = (from, to, callback = () => {}) => {
  if (!hosts [from]) return;

  hostile.remove(from, to, function (err) {
    if (err) {
      console.error(err)
    } else {
      console.log('set /etc/hosts successfully!')
    }
  })
}

const add = (from, to, callback = () => {}) => {
  hostile.set('127.0.0.1', 'peercdn.com', function (err) {
    if (err) {
      console.error(err)
    } else {
      hosts[from] = {
        from: from,
        to: to,
        callback: callback
      }
      sendMessage({ actions: 'add', status: 'success', payload: { from: from, to: to, callback: callback }})
      console.log('set /etc/hosts successfully!')
    }
  })
}

module.exports = {
  init, add, remove
}
