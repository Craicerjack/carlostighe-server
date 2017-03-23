var SpotifyWebApi = require('spotify-web-api-node');
var config = require('../config/spotify')();
var express = require('express');
var router = express.Router();

var spotifyApi = new SpotifyWebApi({
    clientId: config.client_id,
    clientSecret: config.client_secret,
    redirectUri: config.redirect_uri,
    scopes: config.scopes
});

spotifyApi.clientCredentialsGrant()
.then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
}, function(err) {
    console.log('Something went wrong!', err);
});

router.route('/')
    .all(function(req, rews, next) {
        next();
    })
    .get(function(req, res, next) {
        spotifyApi.getUserPlaylists(config.user_id)
            .then(function(data) {
                console.log('Retrieved playlists', data.body);
            },function(err) {
                console.log('Something went wrong!', err);
            });
    });

module.exports = router;