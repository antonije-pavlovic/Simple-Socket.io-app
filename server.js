const http = require('http').createServer();
const io = require('socket.io')(http);
const url = require('url');
const port = 3000;

let namespaces = [];
let targetNamespace;
io.on('connection', socket => {
  if(socket.handshake.query.namespace) {
    console.log(socket);
    targetNamespace = socket.handshake.query.namespace;
    console.log('tager namespace: ' + targetNamespace);

    if(namespaces && namespaces.includes(targetNamespace)) {
      io
        .of('/' + targetNamespace)
        .on('connection', socket => {
          console.log('dosao');
          socket.emit('enterNamespace', 'welcome to your organization')
        })
    }
  }
});

io
  .of('/login')
  .on('connection', socket => {
    // TODO: varify token and get parameters
    // TODO: if everything is ok emit success, if it's not emit error
    const { organizationId, userId, type } = socket.handshake.query;
    namespaces.push(organizationId);
    socket.emit('successfullyLogin', { namespace: organizationId, room: type })
  });




/*
io.on('connection', socket => {
  console.log('new client connected');
  socket.emit('welcome', 'Hello there and welcome to socket io server')

});

const chatRooms = ['lol', 'wow', 'csgo'];
io
  .of('/games')
  .on('connection', socket => {

    socket.emit('welcome', 'Hello and welcome to games namespace');

    socket.on('joinroom', room => {
      // TODO: if there is no room socketIO will make room
      if(chatRooms.includes(room)){
        socket.join(room);
        io
          .of('/games') // TODO: specify to which group to emit
          .in(room) // TODO: in because testing, in other cases use to
          .emit('newUser', `New player has joined the ${ room }`);
        socket.emit('success', 'you have successfully joined this room')
    } else {
        socket.emit('error', `No room named ${ room }`)
      }
    socket.disconnect();
    })
  });

 */
http.listen(port, () => console.log(`server is listening on port: ${ port }`));
