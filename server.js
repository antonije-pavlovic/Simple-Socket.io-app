require('dotenv').config();
const http = require('http').createServer();
const io = require('socket.io')(http);
const { decodeToken, getToken } = require('./token');
const port = 3000;

// TODO: this need to be unique array
const availableNamespaces = [];
const availableRooms = ['employee', 'manager'];

/***** LOGIN ******/
io
  .of('/login')
  .on('connection', async socket => {
    const { token } = socket.handshake.query;
    const { organizationId, type } = await decodeToken(token, process.env.SECRET);

    availableNamespaces.push(organizationId);
    const payload = {
      socketId: socket.conn.id,
      room: type,
      namespace: organizationId
    };
    const accessToken = await  getToken(payload, process.env.SECRET, { tokenLife: process.env.TOKEN_LIFE });

    socket.emit('successfullyLogin', { namespace: organizationId, room: type, accessToken })
  });

/***** NAMESPACE ******/
// TODO: make regular expression better
io
  .of(/^\/namespace\/.+$/)
  .use(async (socket, next) => {

    const targetNamespace = socket.nsp.name;
    const { accessToken } = socket.handshake.query;
    const { socketId, namespace, room } = await decodeToken(accessToken, process.env.SECRET);
    socket.meta.room = room
    if(namespace !== targetNamespace && socketId !== socket.conn.id) {
      console.log('you dont have permission to access this namespace');
      socket.disconnect()
    }else {
      console.log('middleware running...');
      next()
    }
  })
  .on('connection', socket => {
    const nsp = socket.nsp.name;
    socket.emit('enterNamespace', 'Welcome to your organization');
    socket.on('joinRoom', async data => {
      const { room } = await decodeToken(data.accessToken, process.env.SECRET);
      if(availableRooms.includes(data.targetRoom) && data.targetRoom === room) {
        socket.join(data.targetRoom);
        if(data.targetRoom === 'manager') {
          io
            .of(nsp)
            .to('employee')
            .emit('managerOnline', `Manager is online`);
        }
        socket.emit('success', 'you have successfully joined this room')
      }else {
        socket.disconnect();
        console.log('you dont have permission to access this room')
      }
    })
  });

http.listen(port, () => console.log(`server is listening on port: ${ port }`));