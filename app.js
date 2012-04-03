var express = require('express'),
    util = require('util'),
    fs = require('fs'),
    app = express.createServer(),
    instagram = require('./src/instagram_client.js');

var port = (process.env.PORT || 3000),
    instagramClient = new instagram.Client(process.env.instagram_client_id);

app.use(express.bodyParser());

app.get('/style.css', function(request, response){
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.write(fs.readFileSync(__dirname + '/public/stylesheets/style.css', 'utf8'));
    response.end();
});

app.get('/socket.io.js', function(request, response){
    response.writeHead(200, {'Content-Type': 'text/javascript'});
    response.write(fs.readFileSync(__dirname + '/public/javascripts/socket.io.js', 'utf8'));
    response.end();
});

app.get('/', function(request, response){
  fs.readFile('./index.html', function(error, content) {
    if (error) {
      response.writeHead(500);
      response.end();
    }
    else {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.end(content, 'utf-8');
    }
  });
});

app.get('/callback', function(request, response){
  if(request.param("hub.challenge") != null){
    response.send(request.param("hub.challenge"));
  } else {
    console.log("ERROR on suscription request: %s", util.inspect(request));
  }
});

app.post('/callback', function(request, response){
  // request.body is a JSON already parsed
  instagramClient.searchAndPublish(request.body);
  response.writeHead(200);
});

app.listen(port, function(){
  console.log("Listening in port %d", port);
});

