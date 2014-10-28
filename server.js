var static = require('node-static');
var file = new static.Server('./');
var server = require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response)
  }).resume();
});
// var dc = require('datachannel.io').listen(server);

var connections = [];
var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {

  socket.emit('welcome', socket.id);
  socket.on('recording', function (message) {
    console.log('Got message: ', socket.id, arguments.length);
		socket.broadcast.emit('recording', {
			recording: message,
			sender: socket.id
		});
  });
});



server.listen(process.env.PORT || 5000);
