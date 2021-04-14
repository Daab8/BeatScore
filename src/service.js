const fs = require('fs');
const { pageHTML, selectPlayerHTML } = require('./utils/templates');
const processPlayerData = require('./utils/processPlayerData');
const findCachedPage = require('./utils/findCachedPage');
const prepareHTMLTables = require('./utils/prepareHTMLTables');
const { processChangeFile, getLastModified } = require('./utils/utils');

const filesFolder = `${__dirname}/../files`;
const backupPath = `${filesFolder}/backup.json`
const cachedPages = {};

module.exports = (savePath, reset, currentPlayer) => {
  // get times of last modification for save and cache files
  const lastModified = getLastModified(savePath, filesFolder);
  let changeTime;
  if (fs.existsSync(`${filesFolder}/cache_${currentPlayer}.json`)) {
    changeTime = Date.parse(fs.statSync(`${filesFolder}/cache_${currentPlayer}.json`).mtime);
  }

  // check if cached page is still actual and use it
  const findCachedPageResult = findCachedPage(
    currentPlayer, cachedPages, lastModified, changeTime, reset,
  );
  if (findCachedPageResult) {
    return findCachedPageResult;
  }

  // load up-to-date save file
  const localLeaderboards = JSON.parse(fs.readFileSync(backupPath))._leaderboardsData;

  // extract data
  const results = processPlayerData(localLeaderboards);

  // process change file
  let changeFile;
  if (currentPlayer !== 'none') {
    const processChangeFileResult = processChangeFile(
      currentPlayer, results, reset, changeTime, filesFolder,
    );
    if (!processChangeFileResult) { return null; }
    changeTime = processChangeFileResult.changeTime;
    changeFile = processChangeFileResult.changeFile;
  }

  // prepare HTML tables
  const { topScoreHTMLTables, fullComboHTMLTables } = prepareHTMLTables(
    results, changeFile, currentPlayer,
  );

  // get other players for dropdown menu
  const players = Object.values(results.playersByTops)[0]
    .map((record) => record.name).filter((onePlayer) => onePlayer !== currentPlayer);
  if (currentPlayer !== 'none') {
    players.push('none');
  }
  const selectPlayerHTMLOptions = selectPlayerHTML(players);

  // cache data for HTML page
  cachedPages[currentPlayer] = {
    lastModified, topScoreHTMLTables, fullComboHTMLTables, changeTime, selectPlayerHTMLOptions,
  };

  return pageHTML(topScoreHTMLTables,
    fullComboHTMLTables,
    changeTime,
    selectPlayerHTMLOptions,
    currentPlayer);
};
