const express = require('express');
const { open } = require('openurl');
const { networkInterfaces } = require('os');
const generate = require('./src/service');

const PORT = process.env.PORT || '80';
const { SAVE_PATH } = process.env;
const localIP = Object.values(networkInterfaces()).reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []), [])), [])[0];

if (!SAVE_PATH) {
  console.log('Missing required SAVE_PATH parameter');
}

const app = express();

app.get('/', (req, res) => {
  const response = generate(SAVE_PATH);
  return response ? res.send(response) : res.status(500).send('internal error');
});

app.listen(PORT, () => {
  console.log(`Listening on ${localIP || 'localhost'}:${PORT}`);
  open(`http://localhost:${PORT}/`);
});
