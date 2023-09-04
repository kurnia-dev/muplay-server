const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')
const clientId = '9a18f40f9c7a4e659e079864b76f5838';
const redirectUri = 'https://kurniawan-saputro-vue-pk.vercel.app/';
const clientSecret = '97330b1a5534442b9ff61809c81183b4'

const app = express();
app.use(cors())
app.use(bodyParser.json())

app.post('/login', (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri,
    clientId,
    clientSecret
  })

  spotifyApi.authorizationCodeGrant(code).then(data => {
    res.json({
      accesToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in
    })
  }).catch((err) => {
    console.log(err)
    res.sendStatus(400)
  })
});

app.post('/refresh', (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri,
    clientId,
    clientSecret,
    refreshToken
  })

  spotifyApi.refreshAccessToken()
    .then(data => {
      res.json({
        accesToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in
      })
      console.log(data.body);
    }).catch((err) => {
      console.log(err)
      res.sendStatus(400)
    })
});

app.listen(8081)