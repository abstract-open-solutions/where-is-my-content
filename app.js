var app = require('http').createServer(handler),
  io = require('socket.io').listen(app),
  fs = require('fs');


app.listen(8000);


function handler(req, res) {
    var url = require('url').parse(req.url);
    var path = (url.pathname === "/" || (!url.pathname) ?
                '/index.html' : url.pathname);
    fs.readFile(
        __dirname + path,
        function(err, data) {
            if(err) {
                res.writeHead(404);
                return res.end('Error loading '+path);
            }

            res.writeHead(200);
            return res.end(data);
        });
}


io.sockets.on(
    'connection',
    function(socket) {
        socket.on(
            'presenter-source',
            function(data) {
                socket.broadcast.emit('presenter-sink', data);
            });
    });
