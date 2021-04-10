exports.pageHTML = (topScores, fullCombos) => {
  const date = new Date();
  const hours = (`0${date.getHours()}`).slice(-2);
  const minutes = (`0${date.getMinutes()}`).slice(-2);
  const seconds = (`0${date.getSeconds()}`).slice(-2);
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Beat Saber Party Statistics</title>
        <style>
          table {box-shadow:  5px 5px 8px #888888; font-size: 24px; float: left; margin: 12px; border-collapse: collapse;}
          td {padding: 0px 8px 0px 8px; border: 1px solid black; }
          h2 {margin-bottom: 0px;}
          div {clear: left; margin-bottom: 20px}
          .difficultyScore {text-align: center; font-size: 32px; background-color: rgb(150, 150, 255)}
          .difficultyCombo {text-align: center; font-size: 32px; background-color: rgb(255, 150, 150)}
          .score {text-align: right}
          .winner {font-weight: bold; background-color: rgb(255, 225, 50)}
          </style>
      </head>
      <body>
    <div style="width: 100%; text-align: right; font-size: 20px;">
    ${hours}:${minutes}:${seconds}
    </div>
    <div style="margin-left: 25px">
    <div>
    <h2>Top Scores:</h2>
    ${topScores}
    </div><div><br><h2>Full Combos:</h2>
    ${fullCombos}
    </div></div></body></html>
    `;
};

exports.tableHTML = (htmlClass, difficulty, records) => `<table>
<tr>
  <td class="${htmlClass}" colspan="2">${difficulty}</td>
</tr>
${records}
</table>
`;

exports.recordHTML = (winner, name, score) => `<tr${winner ? ' class = "winner"' : ''}>
<td>${name.toUpperCase()}</td>
<td class = "score">${score}</td>
</tr>
`;
