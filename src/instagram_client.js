var https = require("https"),
    util = require('util'),
    querystring = require('querystring');

var Client = function(client_id, io){
  this.client_id = client_id;
  this.io = io;
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
              this.io.sockets.emit('photo', raw);
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
