const fs = require('fs');
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
  if (changeFile && changeFile.playersByTops[difficulty]) {
    const changeRecord = changeFile.playersByTops[difficulty]
      .find((player) => player.name === name);
    if (changeRecord && changeRecord.count >= 0) {
      const change = score - changeRecord.count;
      if (change > 0) { return `+${change}`; }
      if (change < 0) { return `${change}`; }
    }
  }
  return '-';
};

exports.getChangeCombosScore = (changeFile, name, difficulty, score) => {
  if (changeFile && changeFile.playersByFullCombos[difficulty]) {
    const changeRecord = changeFile.playersByFullCombos[difficulty]
      .find((player) => player.name === name);
    if (changeRecord && changeRecord.count >= 0) {
      const change = score - changeRecord.count;
      if (change > 0) { return `+${change}`; }
      if (change < 0) { return `${change}`; }
    }
  }
  return '-';
};

exports.processChangeFile = (currentPlayer, results, reset, changeTime, changeFilePath) => {
  if (reset || !changeTime) {
    if (!fs.existsSync(changeFilePath)) { fs.mkdirSync(changeFilePath); }
    fs.writeFileSync(`${changeFilePath}/cache_${currentPlayer}.json`, JSON.stringify(results));
    if (reset) { return null; }
    return {
      changeFile: results,
      changeTime: Date.parse(fs.statSync(`${changeFilePath}/cache_${currentPlayer}.json`).mtime),
    };
  }
  return {
    changeFile: JSON.parse(fs.readFileSync(`${changeFilePath}/cache_${currentPlayer}.json`)),
    changeTime,
  };
};

exports.getLastModified = (savePath, changeFilePath) => {
  const backupFilePath = `${changeFilePath}/backup.json`;
  const saveLastModified = Date.parse(fs.statSync(savePath).mtime);
  let backupLastModified;
  if (fs.existsSync(backupFilePath)) {
    backupLastModified = Date.parse(fs.statSync(backupFilePath).mtime);
    if (backupLastModified === saveLastModified) {
      return backupLastModified;
    }
  }

  fs.copyFileSync(savePath, backupFilePath);
  return Date.parse(fs.statSync(backupFilePath).mtime);
};
