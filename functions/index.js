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

    // Time calculations.
    const ONE_HOUR = 60 * 60 * 1000;
    const ONE_MINUTE = 60 * 1000;
    const ACCEPTABLE_INTERVAL = 1 * ONE_MINUTE;

    // Get current time.
    let date = new Date();
    const currentTime = date.getTime();

    // Set
    const pHandle = req.query.player;
    const reqPath = 'https://api.fortnitetracker.com/v1/profile/xbl/' + pHandle;
    const apiKey = '883c5178-3127-46a1-82b5-f5faad23262c';
    const options = {
      url: reqPath,
      headers: {
        'TRN-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    };
    const playerRef = admin.database().ref(`/playerStats/${pHandle}`);
    let playerRecord = null;
    return playerRef.on('value', function(data) {
      if (data.exists()) {
        playerRecord = data.val();
        if (currentTime > (playerRecord.created + ACCEPTABLE_INTERVAL)) {
          request.get(options, function (error, response, body) {
            let jsonBody = JSON.parse(body);

            // Modify the new results for write.
            jsonBody.created = currentTime;
            jsonBody.oldStats = playerRecord.stats;

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
