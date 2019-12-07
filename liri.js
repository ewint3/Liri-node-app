// DEPENDENCIES

require("dotenv").config();

var Spotify = require("node-spotify-api");
// Import the API keys
var keys = require("./keys");
// Import the request npm package.
var request = require("request");
// Import the FS package for read/write.
var fs = require("fs");
// Initialize the spotify API client with keys
var spotify = new Spotify(keys.spotify);

// Function for running a Spotify search
var callSpotifyAPI = function(songName) {
  if (songName === undefined) {
    songName = "1999";
  }
  spotify.search(
    {
      type: "track",
      query: songName,
      limit: 15
    },
    function(err, data) {
      if (err) {
        console.log("Error occurred: " + err);
        return;
      }
      var songs = data.tracks.items;
      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("Artist name: " + songs[i].artists[0].name);
        console.log("Song title: " + songs[i].name);
        console.log("Track number: " + songs[i].track_number);
        console.log("Album: " + songs[i].album.name);
        console.log("Release date: " + songs[i].album.release_date);
        console.log("Album type: " + songs[i].album.album_type);
        console.log("Preview song: " + songs[i].preview_url);
        console.log("----------------------------------------------------");
      }
    }
  );
};
// =====================================
// Function for running a OMDB Search
// _____________________________________
var callOMDBAPI = function(movieName) {
  if (movieName === undefined) {
    movieName = "snakes on a plane";
  }
  var urlHit =
  "http://www.omdbapi.com/?t=" +
  movieName +
  "&y=&plot=full&tomatoes=true&apikey=trilogy";
  request(urlHit, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var jsonData = JSON.parse(body);
      console.log("Title: " + jsonData.Title);
      console.log("Year: " + jsonData.Year);
      console.log("Rated: " + jsonData.Rated);
      console.log("IMDB Rating: " + jsonData.imdbRating);
      console.log("Country: " + jsonData.Country);
      console.log("Language: " + jsonData.Language);
      console.log("Plot: " + jsonData.Plot);
      console.log("Actors: " + jsonData.Actors);
      console.log("Rotton Tomatoes Rating: " + jsonData.Ratings[1].Value);
    }
  });
};
// =====================================
// Function for determining which command is executed
// _____________________________________
var userCommand = function(caseData, functionData) {
  switch (caseData) {
    // use twitter api
    case "my-tweets":
    callTwitterAPI();
    break;
    // use spotify api
    case "spotify-this-song":
    callSpotifyAPI(functionData);
    break;
    // use omdb api
    case "movie-this":
    callOMDBAPI(functionData);
    break;

    case "do-what-it-says":
    doWhatItSays();
    break;
    default:
    console.log("LIRI can't understand your nonsense!");
  }
};
// =====================================
// Function to take data from .txt file and send to another function when user enters "do-what-it-says"
// _____________________________________
var doWhatItSays = function () {
  fs.readFile('random.txt', 'utf8', function(error, data){
    console.log(data);
    var dataArr = data.split(',');
    if (dataArr.length ===  2) {
      userCommand(dataArr[0], dataArr[1]);
    } else if (dataArr.length === 1) {
      userCommand(dataArr[0]);
    }
  });
};
// =====================================
// Function which takes in command line arguments and executes switch statement accordigly
// _____________________________________
var cmdLnArgs = function(argOne, argTwo) {
  userCommand(argOne, argTwo);
};
// =====================================
// this takes in user input and assigns them as arguments
// _____________________________________
cmdLnArgs(process.argv[2], process.argv[3]);


