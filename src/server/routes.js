const namedRoutes = {}
const routeHandlers = {}

const makeEndpointObject = (ep) => {
  return {
    name: '',
    endpoint: ep,
    published: false,
    responseIdent: null,
    customResponse: null,
    handler: null,
    enabled: false,
    method: 'get',
  }
}

const makeRouteHandler = () => {
  return {
    name: '',
    handler: null,
    enabled: false,
  }
}

const getRouteDetails = (routeId) => {
  return routeHandlers[routeId]
}

const addRoute = (routeObj, ident) => {
  let id

  if (ident)
    id = ident
  else
    id = routeObj.name.replace(/[^\w\d]/gi, '')

    if (routeHandlers[id]) return false;

    routeHandlers[id] = routeObj
    return id;
}

const disableRoute = (routeId) => {
  if (!namedRoutes[routeId]) return false;
  namedRoutes[routeId] = {
    ...namedRoutes[routeId],
    enabled: false,
  }
  return true;
}

const enableRoute = (routeId) => {
  if (!namedRoutes[routeId]) return false;

  namedRoutes[routeId] = {
    ...namedRoutes[routeId],
    enabled: true,
  }
  return true;
}

const modifyRoute = (routeObj, routeId) => {

}

const addHandler = (handler, ident) => {

}

const modifyHandler = (handlerObj, handlerId) => {

}

const assignHandlerToRoute = (handlerId, routeId) => {

}

const removeHandlerFromRoute = (handlerId, routeId) => {

}

module.exports = {
  getRouteDetails,
  addRoute,
  disableRoute,
  enableRoute,
  modifyRoute,
  addHandler,
  modifyHandler,
  assignHandlerToRoute,
  removeHandlerFromRoute,
};
