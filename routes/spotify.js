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
        spotifyApi.getPlaylist(config.user_id, req.params.playlist_id,  { limit: 40 })
        .then(function(data) {
            console.log( " - formatting data ...");
            var formattedData = {
                "links": { "self": "http://carlostighe.com/spotify/playlists/"+req.params.playlist_id },
                "data": {
                    "type": "spotify.playlist",
                    "id": req.params.playlist_id,
                    "attributes": {
                        "title": data.body.name,
                        "image": data.body.images[1],
                        "total": data.body.tracks.total,
                    },
                    "links": {
                        "self": "http://www.carlostighe.com/spotify/playlist/"+req.params.playlist_id 
                    },
                    "relationships": {
                        "tracks": {
                            "related": data.body.href
                        },
                        "data": data.body.tracks.items.map(function(item) { 
                            return { "type": "spotify.track", "id": item.track.id }
                        })
                    }
                },
                "included": data.body.tracks.items.map(function(item) {
                    return {
                        "type": "spotify.track",
                        "id": item.track.id,
                        "attributes": {
                            "title": item.track.name,
                            "href": item.track.external_urls.spotify,
                            "explicit": item.track.explicit,
                            "duration": item.track.duration_ms,
                            "alname": item.track.album.name,
                            "image": item.track.album.images[1],
                            "artists": item.track.artists.map(function(art) {
                                return art.name;
                            }).join(', ')
                        },
                        "relationships": {
                            "playlist": {
                                "data": { "type": "spotify.playlist", "id": req.params.playlist_id }
                            }
                        }
                    }
                })
            }
            console.log(" - returning data...");
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
                        },
                        "data": []
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