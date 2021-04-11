const fs = require('fs');
const {
  pageHTML, tableHTML, recordHTML, selectPlayerHTML,
} = require('./utils/templates');
const { getChangeTopsScore, getChangeCombosScore } = require('./utils/utils');
const processPlayerData = require('./utils/processPlayerData');

const changeFilePath = `${__dirname}/../changes`;

const cachedPages = {};

module.exports = (savePath, reset, currentPlayer) => {
  let changeTime;

  // check if cached page is actual and use it
  const lastModified = Date.parse(fs.statSync(savePath).mtime);
  if (fs.existsSync(`${changeFilePath}/cache_${currentPlayer}.json`)) {
    changeTime = Date.parse(fs.statSync(`${changeFilePath}/cache_${currentPlayer}.json`).mtime);
    const cachedPage = cachedPages[currentPlayer];

    if (!reset && cachedPage
      && cachedPage.lastModified === lastModified
      && cachedPage.changeTime === changeTime) {
      return pageHTML(cachedPage.topScoreHTMLTables,
        cachedPage.fullComboHTMLTables,
        cachedPage.changeTime,
        cachedPage.selectPlayerHTMLOptions,
        currentPlayer);
    }
  }

  // load up-to-date save file
  const localLeaderboards = JSON.parse(fs.readFileSync(savePath))._leaderboardsData;

  // extract data
  const results = processPlayerData(localLeaderboards);

  // if changes file doesn't exist create it
  let changeFile;
  if (reset || !fs.existsSync(`${changeFilePath}/cache_${currentPlayer}.json`)) {
    fs.writeFileSync(`${changeFilePath}/cache_${currentPlayer}.json`, JSON.stringify(results));
    if (reset) { return null; }
    changeTime = Date.parse(fs.statSync(`${changeFilePath}/cache_${currentPlayer}.json`).mtime);
    changeFile = results;
  } else {
    changeFile = JSON.parse(fs.readFileSync(`${changeFilePath}/cache_${currentPlayer}.json`));
  }

  // prepare top score HTML tables
  const topScoreHTMLTables = Object.keys(results.playersByTops).map((difficulty) => {
    const topScore = results.playersByTops[difficulty][0].count;
    const records = results.playersByTops[difficulty].map((player) => {
      const score = player.count;
      const isWinner = score !== 0 && score === topScore;
      const change = getChangeTopsScore(changeFile, player.name, difficulty, score);
      return recordHTML(isWinner, player.name, score, change, currentPlayer !== 'none');
    }).join('');
    return tableHTML('difficultyScore', difficulty, records, currentPlayer !== 'none');
  }).join('');

  // prepare full combo HTML tables
  const fullComboHTMLTables = Object.keys(results.playersByFullCombos).map((difficulty) => {
    const topScore = results.playersByFullCombos[difficulty][0].count;
    const records = results.playersByFullCombos[difficulty].map((player) => {
      const score = player.count;
      const isWinner = score !== 0 && score === topScore;
      const change = getChangeCombosScore(changeFile, player.name, difficulty, score);
      return recordHTML(isWinner, player.name, score, change, currentPlayer !== 'none');
    }).join('');
    return tableHTML('difficultyCombo', difficulty, records, currentPlayer !== 'none');
  }).join('');

  // get other players for dropdown menu
  const players = Object.values(results.playersByTops)[0]
    .map((record) => record.name).filter((onePlayer) => onePlayer !== currentPlayer);
  if (currentPlayer !== 'none') {
    players.push('none');
  }
  const selectPlayerHTMLOptions = selectPlayerHTML(players);

  // return complete HTML page
  cachedPages[currentPlayer] = {
    lastModified, topScoreHTMLTables, fullComboHTMLTables, changeTime, selectPlayerHTMLOptions,
  };
  return pageHTML(topScoreHTMLTables,
    fullComboHTMLTables,
    changeTime,
    selectPlayerHTMLOptions,
    currentPlayer);
};
