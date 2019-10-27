const io = require('socket.io-client');

const games = io.connect('http://localhost:3000');




/*
games.on('welcome', msg => console.log(`Recived ${ msg }`));

games.emit('joinroom','lol');
games.on('error', msg => console.log(msg));
games.on('success', msg => console.log(msg));
games.on('newUser', msg=> console.log(msg));

 */