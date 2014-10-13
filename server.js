var static = require('node-static');
var file = new static.Server('./');
var server = require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response)
  }).resume();
});
// var dc = require('datachannel.io').listen(server);


var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  socket.on('message', function (message) {
    log('Got message: ', message);
    socket.broadcast.emit('message', message);
  });
});



server.listen(process.env.PORT || 5000);