const http = require('http');

http.createServer(function(req,res){
    res.writeHead(200, {'Content-Type' : 'text/plain'});
    res.end('Hello world\n');
}).listen(8080,'127.0.0.1');

console.log('Server running in http://127.0.0.1:8080/');