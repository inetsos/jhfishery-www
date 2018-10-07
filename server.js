var express = require('express');
var cors = require('cors');
var vhost = require('vhost');
var app     = express();
var path    = require('path');

// Angular
app.use(express.static(path.resolve(__dirname, './dist/jhfishery-www'))); //1
app.get('*', function (req, res) { //2
  var indexFile = path.resolve(__dirname,'./dist/jhfishery-www/index.html');
  res.sendFile(indexFile);
});

// Server
var server = express();
var hostname = 'jhfishery-www.ebizpia.co.kr';
var port = 3301;

server.use(vhost(hostname, app));

//var port = process.env.PORT || 4000; //3
server.listen(port, function(){
    console.log(`Server running at http://${hostname}:${port}/`);
});