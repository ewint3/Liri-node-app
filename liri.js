require("dotenv").config();
var keys = require("./keys");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var dateFormat = require("dateFormat");
var fs = require("fs");

var concertThis = function (artist) {
    var region = ""
    var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"


    request(queryUrl, function (err, response, body) {

        if (!err && response.statusCode === 200) {

            var concertInfo = JSON.parse(body)

            outputData(artist + " concert information:")

            for (i = 0; i < concertInfo.length; i++) {

                region = concertInfo[i].venue.region

                if (region === "") {
                    region = concertInfo[i].venue.country
                }
                outputData("Venue: " + concertInfo[i].venue.name)
                outputData("Location: " + concertInfo[i].venue.city + ", " + region);
                outputData("Date: " + dateFormat(concertInfo[i].datetime, "mm/dd/yyyy"))
            }
        }
    })
}

var spotifyThisSong = function (song) {
    if (!song) {
        song = "The Sign Ace of Base"
    }
    var spotify = new Spotify(keys.spotify);

    spotify.search({ type: "track", query: song, limit: 1 }, function (err, data) {
        if (err) {
            return console.log(err)
        }

        var songInfo = data.tracks.items[0]
        outputData(songInfo.artists[0].name)
        outputData(songInfo.name)
        outputData(songInfo.album.name)
        outputData(songInfo.preview_url)
    })
}

var movieThis = function (movie) {
    if (!movie) {
        movie = "Mr.+Nobody"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    //console.log(queryUrl);

    // Then create a request to the queryUrl
    request(queryUrl, function (err, response, body) {
        // If the request is successful
        if (!err && response.statusCode === 200) {
            // Need to return: Title, Year, IMDB Rating, Rotten Tomatoes Rating, Country, 
            // Language, Plot, Actors
            var movieInfo = JSON.parse(body)

            outputData("Title: " + movieInfo.Title)
            outputData("Release year: " + movieInfo.Year)
            outputData("IMDB Rating: " + movieInfo.imdbRating)
            outputData("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value)
            outputData("Country: " + movieInfo.Country)
            outputData("Language: " + movieInfo.Language)
            outputData("Plot: " + movieInfo.Plot)
            outputData("Actors: " + movieInfo.Actors)
        }
    })
}

var doWhatItSays = function () {

    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) {
            return console.log(err)
        }

        var dataArr = data.split(",")
        runAction(dataArr[0], dataArr[1])
    });
}

var outputData = function (data) {
    console.log(data)

    fs.appendFile("log.txt", "\r\n" + data, function (err) {
        if (err) {
            return console.log(err)
        }
    })
}

var runAction = function (func, parm) {
    switch (func) {
        case "concert-this":
            concertThis(parm)
            break
        case "spotify-this-song":
            spotifyThisSong(parm)
            break
        case "movie-this":
            movieThis(parm)
            break
        case "do-what-it-says":
            doWhatItSays()
            break
        default:
            outputData("That is not a command that I recognize, please try again.")
    }
}

runAction(process.argv[2], process.argv[3])



