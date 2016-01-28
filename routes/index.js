var express = require("express");
var app = express();
var port = 3700;
var request = require('request');
var fs = require('fs');
var interpolate = require('interpolate');

//Load the list of authors
app.get("/authors", function(req, res) {
    res.write("<!DOCTYPE html><html><head><head><title>WhitakerRipperV3</title><meta name='viewport' content='width=device-width, initial-scale=1.0'/></head><body>");
    var authorList = getAuthorList();
    for(var w=0; w<= authorList.length-1; w++)
    {
        res.write("<a href='/authors/"+authorList[w]+"/null'>"+authorList[w]+"</a>");
        res.write("</br>");
    }
    res.write("</body></html>");
    res.end();
});

//Load the list of an author's stories
app.get("/authors/*/null", function(req, res) {
    res.write("<!DOCTYPE html><html><head><head><title>WhitakerRipperV3</title><meta name='viewport' content='width=device-width, initial-scale=1.0'/></head><body>");
    var authorList = getAuthorList();
    var url = req.originalUrl; //Get the actual url
    var spliturl = url.split("/"); //Get the individual parts of the url
    var author = spliturl[2]; //Get author for redirect
    var storyList = getStoryListOfAuthor(author);
    for(var w=0; w<= authorList.length-1; w++)
    {
        res.write("<a href='/authors/"+author+"/"+storyList[w]+"'>"+storyList[w]+"</a>");
        res.write("</br>");
    }
    res.write("</body></html>");
    res.end();
});

//Load the actual story
app.get("/authors/*/*", function(req, res) { //The author's story
    var result;
    fs.readFile('onload.js', 'utf8', function (err,data) {
        if (err) {
            console.log(err);
        }
        //console.log(data);
        result = data;
        //console.log(result);
        res.write("<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css"><script src="http://code.jquery.com/jquery-1.11.3.min.js"></script><script src="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.js"></script></head><body>")
        //console.log(result);
        res.write("<script>"+result+"</script>");
        var authorList = getAuthorList();
        var url = req.originalUrl; //Get the actual url
        var spliturl = url.split("/"); //Get the individual parts of the url
        var author = spliturl[2]; //Get story name
        var storyName = spliturl[3]; //Get story name
        if(storyName != "null")
        {
            var storyList = getStoryListOfAuthor(author);
            for(var w=0; w<= authorList.length-1; w++)
            {
                if(storyList[w] == storyName)
                {
                    res.write("<h1>"+storyList[w]+"</h1>");
                    res.write("</br>");
                    w = authorList.length;
                }
            }
            var splitStory = returnStorySplit(storyName);
            //var vocabList = getVocab(storyName);
            //res.write(splitStory[0])
            for(var e=0; e<= splitStory.length-1; e++)
            {
                //console.log(vocabList[e]);
                //res.write("<a onclick='alert('"+vocabList[e]+"', 4000)'>"+splitStory[e]+"</a> ");
                res.write("<a class='waves-effect waves-light modal-trigger white black-text z-depth-0' href='#modal1'>Modal</a>");
                res.write();
            }
            res.write("</body></html>");
            res.end();
        }
    });
});


app.get("/submit", function(req, res) { //Submit a story
    //res.write("<!DOCTYPE html><html><head><head><title>WhitakerRipperV3</title><script src='https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'></script><link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css'><script src='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js'></script></head><body>");
    res.sendFile(__dirname + '/submit.html');
    if(story != null)
    {
        var story = req.query['story']; //get storyName
        var author = req.query['author'];
        var text = req.query['text'];

        var jsonStory = {"story": story, "author": author, "text": text};
        //Need to add to data.json
/*
        var splitStory = text.split(/[^A-Za-z]/);
        var currentWord;
        var definition;
        for(var g=0; g<= splitStory.length-1; g++)
        {
            currentWord = splitStory[g];
            request('http://archives.nd.edu/cgi-bin/wordz.pl?keyword='+currentWord, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    //console.log(body);
                    definition = body;
                }
            });
            jsonStory.vocab[currentWord] = definition;
            console.log(jsonStory.vocab[currentWord])
        }
*/

        //res.write("</body></html>");
        //res.end();
    }
});

app.get("/test", function(req, res) { //The author's story
    res.sendFile(__dirname + '/test.html');
});



function getAuthorList()
{
    var data = require('../data.json');
    var authors = []; //create a list of authors
    for(x in data)
    {
        //console.log(data[x])
        store = data[x]
        for(y in store)
        {
            //console.log(store[y]);
            var store2 = store[y];
            if(authors.indexOf(store2["author"]) == -1)
            {
                authors.push(store2["author"]);
            }
        }
    }
    return authors;
}

function getStoryListOfAuthor(author)
{
    var data = require('../data.json');
    var stories = [];
    var x;
    for(x in data)
    {
        //console.log(data[x])
        var store = data[x]
        var y;
        for(y in store)
        {
            //console.log(store[y]);
            var store2 = store[y];
            if(store2["author"] == author)
            {
                stories.push(store2["story"]);
            }
        }
    }
    //console.log(stories);
    return stories;
}

function returnStorySplit(storyName) //return a story split by spaces, commas, and whitespace
{
    var data = require('../data.json');
    var storyText;
    var x;
    for(x in data)
    {
        //console.log(data[x])
        var store = data[x]
        var y;
        for(y in store)
        {
            var store2 = store[y];
            //console.log(store2["story"]);
            //console.log(storyName);
            if(store2["story"] == storyName)
            {
                storyText = store2["text"];
                //console.log(storyText);
            }
        }
    }
    var splitStoryText = storyText.split(/[^A-Za-z]/); //Split by all non-alphabetic characters
    //console.log(stories);
    return splitStoryText;
}

function getVocab(storyName) //Return an array of vocab words
{
    var data = require('../data.json');
    var vocabList = [];
    var x;
    for(x in data)
    {
        //console.log(data[x])
        var store = data[x]
        var y;
        for(y in store)
        {
            var store2 = store[y];
            //console.log(store2["story"]);
            //console.log(storyName);
            if(store2["story"] == storyName)
            {
                vocabJSON = store2["vocab"];
                for(z in vocabJSON)
                {
                    var a;
                    vocabJSON2 = vocabJSON[z];
                    for(a in vocabJSON2)
                    {
                        vocabList.push(vocabJSON2[a]);
                    }
                }
                //console.log(storyText);
            }
        }
    }

    //console.log(stories);
    return vocabList;
}

function ripWhitaker(word)
{
    request('http://archives.nd.edu/cgi-bin/wordz.pl?keyword='+word, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //console.log(body);
            return body;
        }
    });
}


app.listen(port, function () {
  console.log('On index.js listening on port '+port);
});
