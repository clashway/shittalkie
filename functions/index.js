const functions = require('firebase-functions');
const request = require('request');
const cors = require('cors')({
  origin: true
});
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.getPlayer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    // Set Response options.
    res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

    // Set the query string.
    const pHandle = req.query.player;

    // Time calculations.
    const ONE_MINUTE = 60 * 1000;
    const UPDATE_LIVE_STATS_INTERVAL = 15 * ONE_MINUTE;

    // Get current time.
    let date = new Date();
    const currentTime = date.getTime();

    // Request options.
    const options = {
      url: 'https://api.fortnitetracker.com/v1/profile/xbl/' + pHandle,
      headers: {
        'TRN-Api-Key': '883c5178-3127-46a1-82b5-f5faad23262c',
        'Content-Type': 'application/json'
      }
    };

    let playerRecord = null;
    const playerRef = admin.database().ref(`/playerStats/${pHandle}`);
    return playerRef.once('value', function (data) {
      if (data.exists()) {
        playerRecord = data.val();
        if (currentTime > (playerRecord.created + UPDATE_LIVE_STATS_INTERVAL)) {
          request.get(options, function (error, response, body) {
            let jsonBody = JSON.parse(body);

            // Modify the new results for write.
            jsonBody.created = currentTime;

            // Every 24 hours update old stats.
            if (playerRecord.oldStats) {
              jsonBody.oldStats = playerRecord.oldStats;
            } else {
              jsonBody.oldStats = {};
            }

            // Write new results.
            playerRef.set(jsonBody);
            console.log('updated existing record');

            // Return as JSON.
            res.json(jsonBody);
          });
        } else {
          console.log('returned existing record');
          res.json(playerRecord);
        }
      } else {
        request.get(options, function (error, response, body) {
          let jsonBody = JSON.parse(body);
          jsonBody.created = currentTime;
          jsonBody.oldStats = {};
          if (jsonBody.stats) {
            jsonBody.oldStats = jsonBody.stats;
            jsonBody.oldStats.created = jsonBody.created;
          }
          playerRef.set(jsonBody);
          console.log('wrote new record');
          res.json(jsonBody);
        });
      }
    }, function (error) {
      console.log('error with query');
    });
  });
});

exports.reset_stats = functions.pubsub
  .topic('reset-stats-tick')
  .onPublish(message => {
    let date = new Date();
    let currentTime = date.getTime();
    const playerRef = admin.database().ref('playerStats');
    return playerRef.once('value').then(function (snapshot) {
      if (!snapshot.exists()) {
        console.log('no data there');
        return false;
      }
      snapshot.forEach(function (data) {
        let playerName = data.key;
        let playerRecord = data.val();
        if (!playerRecord.hasOwnProperty('stats')) {
          return false;
        }
        playerRecord.created = currentTime;
        playerRecord.oldStats = playerRecord.stats;
        playerRecord.oldStats.created = playerRecord.created;
        writeData(playerName, playerRecord);
      });
    });

    function writeData(name, record) {
      admin.database().ref(`/playerStats/${name}`).set(record);
      console.log('reset stats for ' + name);
    }
  });
