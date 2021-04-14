const difficultyLevels = {
  Easy: 1,
  Normal: 2,
  Hard: 3,
  Expert: 4,
  Plus: 5,
};

const compareTopsDifficulty = (a, b, difficulty) => {
  const countA = a.tops[difficulty] || 0;
  const countB = b.tops[difficulty] || 0;
  if (countA > countB) { return -1; }
  if (countA < countB) { return 1; }
  return 0;
};

const compareCombosDifficulty = (a, b, difficulty) => {
  const countA = a.fullCombos[difficulty] ? a.fullCombos[difficulty].size : 0;
  const countB = b.fullCombos[difficulty] ? b.fullCombos[difficulty].size : 0;
  if (countA > countB) { return -1; }
  if (countA < countB) { return 1; }
  return 0;
};

const compareDifficulty = (a, b) => {
  const countA = difficultyLevels[a] || 6;
  const countB = difficultyLevels[b] || 6;
  if (countA > countB) { return 1; }
  if (countA < countB) { return -1; }
  return 0;
};

module.exports = (localLeaderboards) => {
  const players = {};
  const difficulties = new Set();

  // iterate through all records, extracting relevant data for each player
  localLeaderboards.forEach((map) => {
    const difficulty = map._leaderboardId.split(/(?=[A-Z])/).pop();
    difficulties.add(difficulty);

    // check top record
    const name = map._scores[0]._playerName;
    if (players[name]) {
      if (players[name].tops[difficulty]) {
        players[name].tops[difficulty] += 1;
      } else {
        players[name].tops[difficulty] = 1;
      }
    } else {
      players[name] = {
        tops: {},
        fullCombos: {},
      };
      players[name].tops[difficulty] = 1;
    }

    // check full combos
    map._scores.forEach((score) => {
      if (score._fullCombo) {
        if (!players[score._playerName]) {
          players[score._playerName] = {
            tops: {},
            fullCombos: {},
          };
        }
        if (players[score._playerName].fullCombos[difficulty]) {
          players[score._playerName].fullCombos[difficulty].add(map._leaderboardId);
        } else {
          players[score._playerName].fullCombos[difficulty] = new Set().add(map._leaderboardId);
        }
      }
    });
  });

  const results = {
    playersByTops: {},
    playersByFullCombos: {},
  };

  // sort players by difficulties
  Array.from(difficulties)
    .sort(compareDifficulty)
    .forEach((difficulty) => {
      const playersByTops = Object.entries(players)
        .sort((a, b) => compareTopsDifficulty(a[1], b[1], difficulty))
        .map(([name]) => ({ count: players[name].tops[difficulty] || 0, name }));

      const playersByFullCombos = Object.entries(players)
        .sort((a, b) => compareCombosDifficulty(a[1], b[1], difficulty))
        .map(([name]) => {
          const record = players[name].fullCombos[difficulty];
          return {
            count: record ? record.size : 0, name,
          };
        });

      results.playersByTops[difficulty] = playersByTops;
      results.playersByFullCombos[difficulty] = playersByFullCombos;
    });

  return results;
};
