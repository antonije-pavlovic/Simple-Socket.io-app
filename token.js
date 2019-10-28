const jwt = require('jsonwebtoken');

function getToken(payload, secret, options) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(payload, secret, { expiresIn: options.tokenLife });
    resolve(token)
  })
}

function decodeToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decode) => {
      if (err) {
        reject(err)
      }
      resolve(decode)
    })
  })
}

module.exports = { getToken, decodeToken };