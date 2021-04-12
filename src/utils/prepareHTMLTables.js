const { tableHTML, recordHTML } = require('./templates');
const { getChangeTopsScore, getChangeCombosScore } = require('./utils');

module.exports = (results, changeFile, currentPlayer) => {
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

  return { topScoreHTMLTables, fullComboHTMLTables };
};
