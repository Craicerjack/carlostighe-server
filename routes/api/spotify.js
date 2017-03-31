var SpotifyWebApi = require('spotify-web-api-node');
var spotify = require('../../config/spotify');
var config = spotify.config();
var express = require('express');
var router = express.Router();
console.log(config, " - config");

var spotifyApi = new SpotifyWebApi({
    clientId: config.client_id,
    clientSecret: config.client_secret,
    redirectUri: config.redirect_uri,
    scopes: config.scopes
});
spotifyApi.clientCredentialsGrant().then(function(data) {
    console.log("Setting up spotify access...");
    spotifyApi.setAccessToken(data.body['access_token']);
}, function(err) {
    res.end('Something went wrong!', err);
});

router.route('/playlists/:playlist_id')
    .get(function(req,res,next) {
        spotifyApi
            .getPlaylist(config.user_id, req.params.playlist_id,  { limit: 40 })
            .then(function(data) {
                res.json(spotify.formatPlaylist(data, req.params.playlist_id));
            },function(err) {
                console.log('Something went wrong!', err);
            }); 
    });

router.route('/playlists')
    .get(function(req, res, next) {
        console.log(" - in get");
        spotifyApi.getUserPlaylists(config.user_id, { limit: 40 })
            .then(function(data) {
                res.json(spotify.formatPlaylists(data));
            },function(err) {
                console.log('Something went wrong!', err);
            });
    });


module.exports = router;