const { getCurrentTime } = require('./utils');

exports.pageHTML = (topScores, fullCombos, changeTime, selectPlayerOptions, player) => `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="1">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BeatScore</title>
        <style>
          table {box-shadow: 5px 5px 8px #888888; font-size: 24px; float: left; margin: 12px; border-collapse: collapse;}
          td {padding: 0px 8px 0px 8px; border: 1px solid black; text-align: center;}
          h2 {margin-bottom: 0px;}
          div {clear: left; margin-bottom: 20px}
          .difficultyScore {text-align: center; font-size: 32px; background-color: rgb(150, 150, 255)}
          .difficultyCombo {text-align: center; font-size: 32px; background-color: Violet}
          .score {text-align: right}
          .winner {font-weight: bold; background-color: rgb(255, 225, 50)}
          span {font-size: 20px;}
          button {
            background-color: Orange;
            color: black;
            border: 1px solid black;
            font-size: 20px;
            border-radius: 4px;
            box-shadow:  3px 3px 5px #888888;
          }
          </style>
      </head>
      <body>
        <div style="width: fit-content;">
          <div style="text-align: right; font-size: 20px;">${getCurrentTime()}</div>
          <div style="margin-left: 25px">
            <div>
              <h2>Top Scores:</h2>
              ${topScores}
            </div>
            <div>
              <br><h2>Full Combos:</h2>
              ${fullCombos}
            </div>
          </div>
          <div style="text-align: right; padding-top: 25px">
            ${changeTime ? `<span>Changes since: <b style="margin-left: 8px;">${new Date(changeTime - new Date(changeTime).getTimezoneOffset() * 60000).toISOString().replace(/T/, ' ').replace(/\..+/, '')}</b></span>` : ''}
            <div style="padding-top: 5px; font-size: 20px">
              Player:
              <select style="margin-right: 15px" onchange="this.options[this.selectedIndex].value && (window.location = this.options[this.selectedIndex].value);">
                <option value="/">${player.toUpperCase()}</option>
                ${selectPlayerOptions}
              </select>
              ${changeTime ? `<button onclick="location.href='?reset=true&player=${player}'" type="button">Reset Changes</button>` : ''}
            </div>
          </div>
        </div>
      </body>
    </html>
    `;

exports.tableHTML = (htmlClass, difficulty, records, forPlayer) => `<table>
<tr>
  <td class="${htmlClass}" colspan="${forPlayer ? 3 : 2}">${difficulty}</td>
</tr>
${records}
</table>
`;

exports.recordHTML = (winner, name, score, change, forPlayer) => `<tr${winner ? ' class = "winner"' : ''}>
<td>${name.toUpperCase()}</td>
<td class = "score">${score}</td>
${forPlayer ? `
<td${change !== '-' ? (` style = "background-color: ${change > 0 ? 'LightGreen' : 'LightCoral'}"`) : ''}>
${change}
</td>
` : ''}`;

exports.selectPlayerHTML = (players) => players.map((player) => `<option value="${player === 'none' ? '/' : `?player=${player}`}">${player.toUpperCase()}</option>`);
