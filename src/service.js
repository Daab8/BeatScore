const fs = require('fs');
const { pageHTML, tableHTML, recordHTML } = require('./utils/templates');
const processPlayerData = require('./utils/processPlayerData');

module.exports = (savePath) => {
  let localLeaderboards;

  // load save file
  try {
    localLeaderboards = JSON.parse(fs.readFileSync(savePath))._leaderboardsData;
  } catch (error) {
    return console.log('Error while loading save data file:', error.message);
  }

  // extract data
  const results = processPlayerData(localLeaderboards);

  // prepare top score HTML tables
  const topScoreHTMLTables = Object.keys(results.playersByTops).map((difficulty) => {
    const topScore = results.playersByTops[difficulty][0].tops[difficulty] || 0;
    const records = results.playersByTops[difficulty].map((player) => {
      const score = player.tops[difficulty] || 0;
      return recordHTML(score !== 0 && score === topScore, player.name, score);
    });
    return tableHTML('difficultyScore', difficulty, records.join(''));
  });

  // prepare full combo HTML tables
  const fullComboHTMLTables = Object.keys(results.playersByFullCombos).map((difficulty) => {
    const fullCombos = results.playersByFullCombos[difficulty][0].fullCombos[difficulty];
    const topScore = fullCombos ? fullCombos.size : 0;
    const records = results.playersByFullCombos[difficulty].map((player) => {
      const score = player.fullCombos[difficulty] ? player.fullCombos[difficulty].size : 0;
      return recordHTML(score !== 0 && score === topScore, player.name, score);
    });
    return tableHTML('difficultyCombo', difficulty, records.join(''));
  });

  // return complete HTML page
  return pageHTML(topScoreHTMLTables.join(''), fullComboHTMLTables.join(''));
};
