const { networkInterfaces } = require('os');

module.exports = () => Object.values(networkInterfaces())
  .reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []), [])), [])[0]
  || 'localhost';
