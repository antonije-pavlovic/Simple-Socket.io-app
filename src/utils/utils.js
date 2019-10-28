const io = require('socket.io-client');
const { getToken } = require('./token');

function loginToServer(payload) {
  return new Promise(async (resolve, reject) => {
    const token = await getToken(payload, process.env.SECRET, { tokenLife: process.env.TOKEN_LIFE });
    const login = io.connect(`http://localhost:3000/login?token=${ token }`);
    login.on('successfullyLogin', data => {
      resolve(data)
    })
  })
}

function connectToOrganizationNamespace(namespace, accessToken) {
  return new Promise((resolve, reject) => {
    const organization = io.connect(`http://localhost:3000/namespace/${ namespace }?accessToken=${ accessToken }`);
    resolve(organization)
  })
}

module.exports = { loginToServer, connectToOrganizationNamespace };