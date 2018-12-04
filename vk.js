/*var vkAuth = require('vk-auth')(123456, 'audio');

vkAuth.authorize('89053178980', 'literatyra');

//var x = new XMLHttpRequest();


vkAuth.on('error', function(err) {
    console.log(err);
});

vkAuth.on('auth', function(tokenParams) {
    console.log ('kek');
})*/
var vkAuth = require('vk-auth')(123456, 'audio');


const express = require("express");
const bodyParser = require("body-parser");
  
const app = express();
  
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
 
app.get("/front", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/front.html");
});
app.post("/front", urlencodedParser, function (request, response) {
    if(!request.body) {return response.sendStatus(400);}
    else
    {
   console.log(request.body);
    vkAuth.authorize(request.body.Login, request.body.Password);
    vkAuth.on('error', function(err) {
    //console.log(err);
});

vkAuth.on('auth', function(tokenParams) {
    console.log ('kek '+tokenParams.user_id);
    response.send(`user_id =` +tokenParams.user_id);
})
    }
});
    //}
 
  
app.get("/", function(request, response){
    response.send("Главная страница");
});
app.listen(3000);