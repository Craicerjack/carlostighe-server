var SpotifyWebApi = require('spotify-web-api-node');
var spotify = require('../config/spotify');
var config = spotify.config();
var express = require('express');
var router = express.Router();

var spotifyApi = new SpotifyWebApi({
    clientId: config.client_id,
    clientSecret: config.client_secret,
    redirectUri: config.redirect_uri,
    scopes: config.scopes
});

spotifyApi.clientCredentialsGrant().then(function(data) {
    console.log(" - Acessing Spotify Api");
    spotifyApi.setAccessToken(data.body['access_token']);
}, function(err) {
    res.end('Something went wrong!', err);
});

router.route('/')
    .all(function(req, res, next) {
        console.log(" - Setting headers..... to vnd.api+json");
        res.setHeader('Content-Type', 'application/vnd.api+json');
        next();
    })
    .get(function(req, res, next) {
        spotifyApi.getUserPlaylists(config.user_id, { limit: 40 })
            .then(function(data) {
                console.log(" - got data....");
                console.log(" - formatting....");
                var formattedData = {
                    "links": { "self": "http://www.carlostighe.com/spotify" },
                    "data": []
                }
                data.body.items.map(function(playlist) {
                    formattedData.data.push({
                        "type": "playlist",
                        "id": playlist.id,
                        "attributes": {
                            "title": playlist.name,
                            "image": playlist.images[1],
                            "noTracks": playlist.tracks.total
                        },
                        "links": {
                            "self": "http://www.carlostighe.com/spotify/playlist/"+playlist.id
                        },
                        "relationships": {
                            "tracks": {
                                "related": playlist.tracks.href
                            }
                        }
                    });
                });
                res.format({
                    json: function() {
                        res.json(formattedData);
                    }
                });
                console.log('Returned Playlists');
            },function(err) {
                console.log('Something went wrong!', err);
            });
    });

module.exports = router;