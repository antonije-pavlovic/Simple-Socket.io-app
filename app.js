const io = require('socket.io-client');

let namespace;
let room;
// TODO: send token instead query parameters
const login = io
  .connect('http://localhost:3000/login?organizationId=1&userId=2&type=manager');

loginToServer(login)
  .then(() => {
      connectToOrganization(namespace)
        .then((orgSocket) => {
          orgSocket.on('enterNamespace', msg => console.log(msg))
        })
        .catch((err) => {
          console.log(err);
        })
  });

/********* functions  ***********/

function loginToServer(login) {
  return new Promise((resolve, reject) => {
    login.on('successfullyLogin', data => {
      console.log(data.namespace);
      namespace = data.namespace;
      room = data.room;
      resolve()
    })
  })
}

function connectToOrganization(namespace) {
  return new Promise((resolve, reject) => {
    const organization = io.connect(`http://localhost:3000?${ namespace }`)
    organization.on('error', msg => {
      console.log(msg);
      reject(msg)
    });
    resolve(organization)
  })
}