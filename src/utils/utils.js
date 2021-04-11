const { networkInterfaces } = require('os');

exports.getCurrentTime = () => {
  const date = new Date();
  const hours = (`0${date.getHours()}`).slice(-2);
  const minutes = (`0${date.getMinutes()}`).slice(-2);
  const seconds = (`0${date.getSeconds()}`).slice(-2);
  return `${hours}:${minutes}:${seconds}`;
};

exports.getLocalIP = () => {
  try {
    return Object.values(networkInterfaces())
      .reduce((r, list) => r.concat(list.reduce((rr, i) => rr.concat((i.family === 'IPv4' && !i.internal && i.address) || []), [])), [])[0]
      || 'localhost';
  } catch (error) {
    console.log(error);
    return 'localhost';
  }
};

exports.getChangeTopsScore = (changeFile, name, difficulty, score) => {
  if (changeFile) {
    const changeRecord = changeFile.playersByTops[difficulty]
      .find((player) => player.name === name);
    const change = score - changeRecord.count;
    if (change > 0) { return `+${change}`; }
    if (change < 0) { return `${change}`; }
  }
  return '-';
};

exports.getChangeCombosScore = (changeFile, name, difficulty, score) => {
  if (changeFile) {
    const changeRecord = changeFile.playersByFullCombos[difficulty]
      .find((player) => player.name === name);
    const change = score - changeRecord.count;
    if (change > 0) { return `+${change}`; }
    if (change < 0) { return `${change}`; }
  }
  return '-';
};
