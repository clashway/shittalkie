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
    res.status(200);

    // Set the query string.
    const pHandle = req.query.player;

    // Time calculations.
    const ONE_HOUR = 60 * 60 * 1000;
    const ONE_MINUTE = 60 * 1000;
    const ACCEPTABLE_INTERVAL = 5 * ONE_MINUTE;

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
    return playerRef.on('value', function(data) {
      if (data.exists()) {
        playerRecord = data.val();
        if (currentTime > (playerRecord.created + ACCEPTABLE_INTERVAL)) {
          request.get(options, function (error, response, body) {
            let jsonBody = JSON.parse(body);

            // Modify the new results for write.
            jsonBody.created = currentTime;

            // Every 24 hours update old stats.
            if (playerRecord.oldStats) {
              if (currentTime > (playerRecord.oldStats.created + 24 * ONE_HOUR) ) {
                jsonBody.oldStats = playerRecord.stats;
                jsonBody.oldStats.created = playerRecord.created;
                console.log('Replaced old stats.');
              } else {
                jsonBody.oldStats = playerRecord.oldStats;
                console.log('Carried over old stats');
              }
            } else {
              console.log('didnt have oldstats');
            }

            // Write new results.
            playerRef.set(jsonBody);
            // console.log('updated existing record');

            // Return as JSON.
            res.json(jsonBody);
          });
        } else {
          // console.log('returned existing record');
          res.json(playerRecord);
        }
      } else {
        request.get(options, function (error, response, body) {
          let jsonBody = JSON.parse(body);
          jsonBody.created = currentTime;
          playerRef.set(jsonBody);
          // console.log('wrote new record');
          res.json(jsonBody);
        });
      }
    }, function (error) {
      console.log('error with query');
    });
  });
});
