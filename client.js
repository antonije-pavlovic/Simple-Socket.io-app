require('dotenv').config();
const io = require('socket.io-client');
const { getToken } = require('./token');

async function init(payload) {

  const data = await loginToServer(payload);
  const organizationSocket = await connectToOrganizationNamespace(data.namespace, data.accessToken);

  organizationSocket.on('enterNamespace', msg => console.log(msg));
  organizationSocket.emit('joinRoom', { targetRoom:  data.room /* 'employee' */, accessToken: data.accessToken });
  organizationSocket.on('success', msg => console.log(msg));
  organizationSocket.on('managerOnline', msg => console.log(msg))

}

/********* FUNCTIONS  ***********/
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

process.on('message', init);