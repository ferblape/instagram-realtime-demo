var express = require('express'),
    util = require('util'),
    fs = require('fs'),
    https = require("https"),
    querystring = require('querystring');

var app = express.createServer(),
    io = require('socket.io').listen(app),
    port = (process.env.PORT || 3000);

// Remove debug messages from socket.io
io.set('log level', 1);

// Allow to parse the body of the POST requests
app.use(express.bodyParser());

// GET /style.css
//   Render public/stylesheets/style.css
app.get('/style.css', function(request, response){
    response.writeHead(200, {'Content-Type': 'text/css'});
    response.write(fs.readFileSync(__dirname + '/public/stylesheets/style.css', 'utf8'));
    response.end();
});

// GET /
//   Render index.html
app.get('/', function(request, response){
  response.writeHead(200, {'Content-Type': 'text/html'});
  response.write(fs.readFileSync('./index.html', 'utf8'));
  response.end();
});

// GET /callback
//   If param hub.callenge is present, renders its value
//   This URL is used by suscription system of Instagram
//   to check if the callback URL provided when creating the suscription
//   is valid and works fine
app.get('/callback', function(request, response){
  if(request.param("hub.challenge") != null){
    response.send(request.param("hub.challenge"));
  } else {
    console.log("ERROR on suscription request: %s", util.inspect(request));
  }
});

// POST /callback
//   Receives POST nofications with the geometries updated
//   Each notification contains a geography_id, which is
//   the identifier of the geography that has a new photo.
//   It's necessary to perform another API call to get the last
//   photo from that geography
app.post('/callback', function(request, response){
  // request.body is a JSON already parsed
  request.body.forEach(function(notificationOjb){
    // Every notification object contains the id of the geography
    // that has been updated, and the photo can be obtained from
    // that geography
    https.get({
      host: 'api.instagram.com',
      path: '/v1/geographies/' + notificationOjb.object_id + '/media/recent' +
      '?' + querystring.stringify({client_id: process.env.instagram_client_id,count: 1}),
    }, function(res){
      var raw = "";

      res.on('data', function(chunk) {
        raw += chunk;
      });

      // When the whole body has arrived, it has to be a valid JSON, with data,
      // and the first photo of the date must to have a location attribute.
      // If so, the photo is emitted through the websocket
      res.on('end', function() {
        var response = JSON.parse(raw);
        if(response['data'].length > 0 && response['data'][0]['location'] != null) {
          io.sockets.emit('photo', raw);
        } else {
          console.log("ERROR: %s", util.inspect(response['meta']));
        }
      });

    });
  });

  response.writeHead(200);
});

// Run the app
app.listen(port, function(){
  console.log("Listening in port %d", port);
});
