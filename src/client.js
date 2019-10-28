require('dotenv').config();
const { connectToOrganizationNamespace, loginToServer } = require('./utils/utils');

async function init(payload) {

  const data = await loginToServer(payload);
  const organizationSocket = await connectToOrganizationNamespace(data.namespace, data.accessToken);

  organizationSocket.on('enterNamespace', msg => console.log(msg));
  organizationSocket.emit('joinRoom', { targetRoom:  data.room, accessToken: data.accessToken });
  organizationSocket.on('success', msg => console.log(msg));
  organizationSocket.on('managerOnline', msg => console.log(msg))
}

process.on('message', init);