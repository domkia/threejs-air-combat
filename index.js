var express = require('express');
var app = express();
var server = require('http').Server(app);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
})
app.use(express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/src'));
app.use('/res', express.static(__dirname + '/res'));

server.listen(3000);