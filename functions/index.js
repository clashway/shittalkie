const functions = require('firebase-functions');
const request = require('request');
const cors = require('cors')({
  origin: true
});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.getPlayer = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const pHandle = req.query.player;
    const reqPath = 'https://api.fortnitetracker.com/v1/profile/xbl/' + pHandle;
    const apiKey = '883c5178-3127-46a1-82b5-f5faad23262c';
    let options = {
      url: reqPath,
      headers: {
        'TRN-Api-Key': apiKey,
        'Content-Type': 'application/json'
      }
    };

    request.get(options, function (error, response, body) {
      res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400');
      res.status(200).json(JSON.parse(body));
    });

    // res.status(200).json({
    //   pHandle: pHandle,
    //   handle: 'lash24',
    //   name: 'Lash',
    //   games: 10,~
    //   kills: 5,
    //   deaths: 4
    // });
  });
});
