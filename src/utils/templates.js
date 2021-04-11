const express = require('express');
const { open } = require('openurl');
const { urlencoded } = require('body-parser');

const generate = require('./src/service');
const { getLocalIP } = require('./src/utils/utils');

const PORT = process.env.PORT || '80';
const { SAVE_PATH } = process.env;

if (!SAVE_PATH) {
  console.log('Missing required SAVE_PATH parameter');
}

const app = express();
app.use(urlencoded({ extended: false }));

app.get('/', (req, res) => {
  try {
    const player = req.query.player || 'none';
    const reset = req.query.reset === 'true' || false;

    if (reset) {
      generate(SAVE_PATH, reset, player);
      const url = player === 'none' ? '/' : `?player=${player}`;
      return res.redirect(303, url);
    }

    return res.send(generate(SAVE_PATH, reset, player));
  } catch (error) {
    console.log(error.message);
    return res.status(500).send('internal error');
  }
});

app.listen(PORT, () => {
  console.log(`Listening on ${getLocalIP()}:${PORT}`);
  open('http://localhost/');
});
