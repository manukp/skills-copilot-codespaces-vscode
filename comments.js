// create web server
var express = require('express');
var app = express();
// create server
var server = require('http').createServer(app);
// create socket
var io = require('socket.io')(server);
// create mongoose
var mongoose = require('mongoose');
// create body-parser
var bodyParser = require('body-parser');
// connect to database
mongoose.connect('mongodb://localhost/comments');
// create schema
var commentSchema = mongoose.Schema({
    name: String,
    comment: String
});
// create model
var Comment = mongoose.model('Comment', commentSchema);
// create urlencodedParser
var urlencodedParser = bodyParser.urlencoded({extended: false});
// create static folder
app.use(express.static(__dirname + '/public'));
// get request
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
// post request
app.post('/comment', urlencodedParser, function(req, res) {
    var newComment = new Comment(req.body).save(function(err, data) {
        if (err) throw err;
        io.emit('comment', req.body);
        res.json(data);
    });
});
// listen to port
server.listen(3000, function() {
    console.log('listening on port 3000');
});