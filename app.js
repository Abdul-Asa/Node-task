const fs = require("fs");
const request = require('request');
const prompt = require('prompt');
const optimist = require('optimist')
var api = "";
var command="";


prompt.override = optimist.argv
prompt.start();
prompt.get([{name: 'term', 
            required: true, 
            description:"Search for a joke based on the search term. Enter 'r' for a random joke. (Shortcut: 'node app.js --term TERM", 
            message: "A command must be entered"}], 
            function (err, result) {
                if (err) return err.message;      
                if(result.term.toLowerCase()==="r"){
                    api = "https://icanhazdadjoke.com";
                }
                else{
                    api = "https://icanhazdadjoke.com/search?term="+result.term;
                }
                command = result.term;
            }
);


request(api,{json: true}, (err,data)=> {
    if(err) return err.message;
    var json;
    if(api === "https://icanhazdadjoke.com"){
        
        json = JSON.stringify(data.body);
        fs.appendFile("joke.txt",json+"\n",(err)=>{
            if(err){
                console.log(err.else);
            }
        });
        console.log(data.body.joke);
    }
    else{
        var jokes = data.body["results"];
        var random = Math.floor(Math.random() * jokes.length);
        json = JSON.stringify(jokes[random]);
        if(jokes[random]!=null){
            fs.appendFile("joke.txt",json+"\n",(err)=>{
                if(err){
                    console.log(err.else);
                }
            });
            console.log(jokes[random].joke);
        }
        else{
            console.log("No jokes found for the term '"+command+"'")
        }
        
        
        
    }
       
    
        
});
