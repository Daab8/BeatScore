const { pageHTML } = require('./templates');

module.exports = (currentPlayer, cachedPages, lastModified, changeTime, reset) => {
  if (currentPlayer === 'none') {
    const cachedPage = cachedPages[currentPlayer];
    if (!reset && cachedPage && cachedPage.lastModified === lastModified) {
      return pageHTML(cachedPage.topScoreHTMLTables,
        cachedPage.fullComboHTMLTables,
        null,
        cachedPage.selectPlayerHTMLOptions,
        currentPlayer);
    }
  } else if (changeTime) {
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
  return null;
};
