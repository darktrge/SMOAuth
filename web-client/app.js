/*jslint node: true */
'use strict';

//Create a proxy that combines the authorization server and
//resource server with this server so that we can make calls
//to both without cross domain issues

var httpProxy = require('http-proxy');
var connect = require('connect');
var https = require('https');
var fs = require('fs');
var finalhandler = require('finalhandler');
var serveStatic = require('serve-static');

//TODO: Change these for your own certificates.  This was generated
//through the commands:
//openssl genrsa -out privatekey.pem 1024
//openssl req -new -key privatekey.pem -out certrequest.csr
//openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem
var options = {
  //This is for the proxy
  ssl: {
    key: fs.readFileSync('certs/privatekey.pem'),
    cert: fs.readFileSync('certs/certificate.pem')
  },
  //This is duplicated for the regular https server
  key: fs.readFileSync('certs/privatekey.pem'),
  cert: fs.readFileSync('certs/certificate.pem')
};

/**
 * The HTTPS Authorization Server
 */
var authServer = httpProxy.createProxyServer({
  target: 'https://localhost:3000',
  secure: false
});

/**
 * The HTTPS Resource Server
 */
var resourceServer = httpProxy.createProxyServer({
  target: 'https://localhost:4000',
  secure: false
});

/**
 * The local HTTP Resource Server
 */
var localServer = httpProxy.createProxyServer({
  target: 'https://localhost:5050',
  secure: false
});

/**
 * Proxy that listens on 5000, which proxies all the
 * Authorization requests to port 3000 and all
 * Resource Servers to 4000
 */

https.createServer(options, function (req, res) {
  if (startsWith(req.url, '/api/tokeninfo') || startsWith(req.url, '/oauth/token') || startsWith(req.url, '/dialog/authorize')) {
    console.log(req.url+ ' sending request to authServer');
    authServer.web(req, res);
  } else if (startsWith(req.url, '/login') || startsWith(req.url, '/info') || startsWith(req.url, '/api/protectedEndPoint')) {
    console.log(req.url+ ' sending request to resourceServer');
    resourceServer.web(req, res);
    //console.log('an error occured while passing request to resourceServer: '+err)
  } else {
    console.log(req.url+ ' sending request to staticFilesServer');
    localServer.web(req, res);
    //console.log('an error occured while passing request to staticFilesServer: '+err);
  }

}).listen(5000);
console.log("Proxy Server started on port 5000");

/**
 * Create a very simple static file server which listens
 * on port 5050, to server up our local static content
 */


// Create server
//var serve = serveStatic('views', {'index': ['index.html', 'index.htm']});
var serve = serveStatic('public',{});
var server = https.createServer(options, function (req, res) {
    var done = finalhandler(req, res);
    serve(req, res, done);
    console.log("staticFilesServer started on port 5050");
});
server.listen(5050);

/*

var path =  require('path');
var express = require('express');
var app = express();

app.use(serveStatic(__dirname + '/views', {'index': ['index.html', 'index.htm']}));
app.use(express.static(path.join(__dirname, 'public')));
var server = app.listen(5050, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('static server listening at http://%s:%s', host, port);
});
*/

/*
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.listen(5050);
*/


/**
 * Function which returns true if str1 starts with str2
 */
function startsWith(str1, str2) {
  return str1.indexOf(str2) === 0;
}
