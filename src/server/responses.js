const namedResponses = {}

const makeResponseObject = () => {
  return {
    name: null,
    response: '',
    type: 'json',
    published: false,
  }
}

const getByName = (name) => {
  return false;
}

const getById = (id) => {
  if (!namedResponses[id]) return;

  return namedResponses[id];
}

const addResponse = (respObj = {}, ident) => {
  let id

  if (ident)
    id = ident
  else
    id = respObj.name.replace(/[^\w\d]/gi, '')

  if (namedResponses[id]) return false;

  namedResponses[id] = respObj;
}

module.exports = {
  responses: () => namedResponses,
  makeResponseObject,
  getByName,
  getById,
  addResponse,
};
