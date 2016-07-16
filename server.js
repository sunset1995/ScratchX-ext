console.log('Running server now...');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);




// Forward to course page anyway
app.get('*', function(req, res){
    res.redirect('https://github.com/mzshieh/snp2016');
});




// Processing socket for ScrathX
io.on('connection', function(socket){
  

    var sid = socket.id;    
    console.log('Connecteion: ' + sid);


    socket.on('disconnect', function() {
        console.log('Disconnect : ' + sid);
    });


});




http.listen(4444, function(){
    console.log('listening on *:4444');
});
