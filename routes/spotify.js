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

router.route('/playlists/:playlist_id')
    .get(function(req,res,next) {
        console.log(" - querying spotify");
        spotifyApi.getPlaylist(config.user_id, req.params.playlist_id)
        .then(function(data) {
            var tracks = data.body.tracks.items.map(function(item) { 
                return { 
                    "type": "spotify.track",
                    "id": item.track.id
                }
            });
            var formattedData = {
                "links": { "self": "http://carlostighe.com/spotify/playlists/"+req.params.playlist_id },
                "data": {
                    "type": "spotify.playlist",
                    "id": data.body.id,
                    "attributes": {
                        "image": data.body.images[1],
                        "name": data.body.name,
                    },
                    "tracks": {
                        "links": {
                            "self": "http://carlostighe.com/spotify/playlists/"+req.params.playlist_id
                        },
                        "data": tracks
                    }
                }
            }
            // data.body.items.map(function(item) {
            //     formattedData.data.push({
            //         "type": "spotify.track",
            //         "id": item.track.id,
            //         "attributes": {
            //             "album": {
            //                 "id": item.track.album.id,
            //                 "image": item.track.album.images[1],
            //                 "name": item.track.album.name
            //             },
            //             "artists": item.track.artists.map(function(artist) {
            //                 return {
            //                     "name": artist.name,
            //                     "id": artist.id
            //                 }
            //             }),
            //             "explicit": item.track.explicit,
            //             "name": item.track.name
            //         }
            //     });
            // });
            console.log(" - returning data");
            res.json(formattedData);
        },function(err) {
            console.log('Something went wrong!', err);
        });
    });

router.route('/playlists')
    .get(function(req, res, next) {
        spotifyApi.getUserPlaylists(config.user_id, { limit: 40 })
        .then(function(data) {
            var formattedData = {
                "links": { "self": "http://www.carlostighe.com/spotify" },
                "data": []
            }
            data.body.items.map(function(playlist) {
                formattedData.data.push({
                    "type": "spotify.playlist",
                    "id": playlist.id,
                    "attributes": {
                        "title": playlist.name,
                        "image": playlist.images[1],
                        "total": playlist.tracks.total
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
            res.json(formattedData);
            console.log('Returned Playlists');
        },function(err) {
            console.log('Something went wrong!', err);
        });
    });



module.exports = router;