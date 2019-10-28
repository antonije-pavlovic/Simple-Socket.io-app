const { fork } = require('child_process');
const users = require('./users');

users.map(user => fork('client.js').send(user));