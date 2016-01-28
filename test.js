var request = require('request');

//Lets try to make a HTTP GET request to modulus.io's website.
request('http://archives.nd.edu/cgi-bin/wordz.pl?keyword=test', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body); // Show the HTML for the Modulus homepage.
    }
});
