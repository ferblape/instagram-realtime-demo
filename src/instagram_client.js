var https = require("https"),
    util = require('util'),
    querystring = require('querystring'),
    io = require('socket.io').listen(8888);

var Client = function(client_id){
  this.client_id = client_id;
}

Client.prototype = {
  searchAndPublish: function(objectList){
    var that = this;

    objectList.forEach(function(obj){
      https.get({
        host: 'api.instagram.com',
        path: '/v1/media/' + obj.object_id +
              '?' + querystring.stringify({client_id: that.client_id}),
      }, function(res){
        var raw = "";
        res.on('data', function (chunk) {
          raw += chunk;
        });
        res.on('end', function () {
          var response = JSON.parse(raw);
          if(response['meta']['code'] == 200) {
            var photo = response['data'];
            // if(photo.location != null){
              console.log(util.inspect(photo));
              io.sockets.emit('photo', raw);
            // }
          } else {
            console.log("ERROR: %s", util.inspect(response['meta']));
          }
        });
      });
    });
  }
}

exports.Client = Client;
