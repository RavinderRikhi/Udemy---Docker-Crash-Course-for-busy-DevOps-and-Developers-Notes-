const http = require('http');
const port = 8080; 
http.createServer(function (req, res) {
  res.write('Hello World!');
  res.end();
}).listen(port);

console.log(`Server Started on port ${port}`);