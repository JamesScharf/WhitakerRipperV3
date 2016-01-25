var express = require("express");
var app = express();
var port = 3700;

//Load the list of authors
app.get("/", function(req, res) {
    res.write("<!DOCTYPE html><html><head><head><title>WhitakerRipperV3</title></head><body>");
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
    res.write("<!DOCTYPE html><html><head><head><title>WhitakerRipperV3</title></head><body>");
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
    res.write("<!DOCTYPE html><html><head><head><title>WhitakerRipperV3</title><script src='https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js'></script><link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/css/materialize.min.css'><script src='https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.5/js/materialize.min.js'></script></head><body>");
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
        var vocabList = getVocab(storyName);
        //res.write(splitStory[0])
        for(var e=0; e<= splitStory.length-1; e++)
        {
            //console.log(vocabList[e]);
            res.write("<a onclick='Materialize.toast('"+vocabList[e]+"', 4000)'>"+splitStory[e]+"</a> ");
            //console.log(splitStory[e-1]);
        }
        res.write("</body></html>");
        res.end();
    }
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


app.listen(port, function () {
  console.log('On index.js listening on port '+port);
});