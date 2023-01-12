const express = require('express')

const responses = require('./responses')
const routes = require('./routes')

const STATUS = {
  running: 'is_running',
  stopped: 'is_stopped',
  undefined: 'is_undefined',
  errror: 'is_error',
}

let ipc = null
let loggerFunc = null
let verbose = false
let server
let port = 3000
let status = STATUS.undefined
let allowedSystemOverride = false

const eventHandlers = {}
const dynamicRoutes = {}
const systemRoutes = ['/', '/status']

const isValidMethod = (m) => {
  if (!m)
    return false;
  if (!['get', 'post', 'put', 'patch', 'delete', 'all'].includes(`${m}`.toLowerCase()))
    return false;

  return true;
}

const createServer = (options = {}) => {
  if (verbose) console.log('(srv) createServer()')

  if (isRunning()) return false;

  if (options.ipc) {
    ipc = options.ipc
  }

  if (options.events) {
    sendNotification('server-status', 'Reading event options')
    const temp = Object.entries(options.events)
    for (const [key, value] of temp) {
      onEvent(key, value)
    }
  }

  if (options.overrideSystemRoutes === 'override') {
    allowSystemOverrides = true
  }

  server = express()
  server.on('mount', (parent) => onEventHandler('mount', parent))
  server.on('error', (err) => onEventHandler('error', err))
  server.on('listening', () => onEventHandler('listening'))
  server.on('close', () => onEventHandler('close'))
  server.on('ready', () => onEventHandler('ready'))
  server.on('timeout', () => onEventHandler('timeout'))
  server.on('connection', () => onEventHandler('connection'))
  server.on('connect', () => onEventHandler('connect'))

  server.get('/status', (req, res) => {
    res.json({
      status: 'up'
    })
  })

  try {
    server.listen(port, () => {
      status = STATUS.running
      server.emit('ready')
      sendNotification('server-event', 'Server is almost ready')
    })
  } catch (err) {
    console.log('(srv) !! Unable to create server\n', err, '\n\n')
  }
}

const serverPort = (p) => {
  if (p) port = parseInt(p)
  return port;
}

const startServer = () => {
  if (isRunning()) return true;
}

const stopServer = () => {
  if (!isRunning()) return false;
  server.close((err) => {
    console.log('err');
  })
}

const destroyServer = () => {
  if (!server) return false;
  // TODO destroy server
  // TODO Notify UI
}

const isRunning = () => {
  if (!server) return false;
  if (status === STATUS.undefined || status === STATUS.stopped) return false;
  if (status === STATUS.error) return false;
  return true;
}

const negotiateRoute = (req, res, next) => {
  if (verbose) console.log('(srv) negotiateRoute')

  const details = routes.getRouteDetails(req.routeid)

  if (!details || !req.routeid) {
    sendNotification('server-error', { error: `Cannot find route for id "${req.routeid}"` })
    return res.status(404).json({ status: 404, message: 'Route Id not found' })
  }

  sendNotification('server-event', 'Negotiating Route')

  let response = {}

  if (!details.enabled) {
    sendNotification('server-event', `Endpoint "${details.name}" is not enabled`)
  }

  if (details.handler) {
    return handler(req, res, next)
  } else if (details.responseIdent) {
    console.log('(srv) Responses: ', responses)
    const temp = responses.getById(details.responseIdent)
    if (temp) response = temp;
  } else if (details.customResponse) {
    response = customResponse;
  }

  let r;

  switch (`${details.type}`.toLowerCase()) {
    case 'json':
      r = res.status(200).json(response)
      break;
    case 'xml':
      res.header('Content-Type', 'application/xml')
      break;
    case 'html':
      res.header('Content-Type', 'text/html')
      break;
    default:
      res.header('Content-Type', 'text/plain')
  }

  if (!r) res.status(200).send(response)

  ipc('response-sent', { endpointId: req.routeid })

  return r;
}

const addRoute = (routeData, callback) => {
  if (verbose) console.log('(srv) addRoute()')
  if (!allowSystemOverride && systemRoutes.includes(routeData.endpoint)) {
    sendNotification(
      'server-error',
      'Trying to override system endpoint without option')
    // res
    //   .status(409)
    //   .json({
    //     status: 'Configuration Conflict',
    //     message: 'The server is not configured to allow override of system endpoints'
    //   })
  }

  const router = express.Router()
  const routeId = routes.addRoute(routeData)

  if (!routeId) {
    sendNotification(
      'server-error',
      'Cannot add route for handler that has already been added')
    return false;
  }

  const rd = { ...routeData }

  router.use((req, res, next) => {
    console.log('(srv) Request Time: ', Date.now())
    const id = routeId;
    req.routeid = id
    return next()
  })

  const method = isValidMethod(routeData.method) ? routeData.method : 'all';

  router[method]('/', negotiateRoute)
  dynamicRoutes[routerData.name] = { ...routeData, router: router }

  server.use(routeData.endpoint, router)
  sendNotification('server-event', `Endpoint "${rd.name}" was set successfully`)

  return true;
}

const onEvent = (evt, handler = () => { }) => {
  if (verbose) console.log('(srv) Registering Event: ', evt)
  if (!evt) return false;
  if (!eventHandlers[evt]) eventHandlers[evt] = []
  eventHandlers[evt].push(handler)
}

const onEventHandler = (evt, res) => {
  if (verbose) {
    console.log('(srv) Server Event Handler: ', evt)
    console.log(`(srv) Handler Payload: \n${res}`)
  }
  if (eventHandlers[evt]) {
    for (let i = 0; i < eventHandlers[evt].length; i++) eventHandlers[evt][i](res)
  }
}

const isVerbose = (v) => {
  if (v !== undefined) {
    verbose = !!v;
  } else {
    return verbose;
  }
}

const provideLogger = (logger) => {
  if (!logger) return false;

  loggerFunct = logger

  return true;
}

const log = (title = '', message = '') => {
  if (loggerFunc) loggerFunct(title, message)
}

const sendNotification = (topic = 'server-event', message = '') => {
  if (!topic || [undefined, null].includes(topic)) topic = 'server-event';
  console.log('(srv) sendNotification: ', ipc, topic, message)
  if (!ipc) return;

  ipc(topic, message)
}

module.exports = {
  createServer,
  destroyServer,
  startServer,
  stopServer,
  isRunning,
  isVerbose, serverPort,
  on: onEvent,
  addRoute,
  provideLogger,
}
