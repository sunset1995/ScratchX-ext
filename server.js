console.log('Running server now...');

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);




// Set http static files serveer
app.use(express.static(__dirname + '/static'));




// Mapping roomID -> {feature: val}
var publisher = {};

// Mapping human readable name -> roomID
var name2rid = {};

// Processing socket for ScrathX
io.on('connection', function(socket){
  

    var myRoomID = 'room_' + socket.id;
    publisher[myRoomID] = {};


    socket.on('disconnect', function() {
        delete publisher[myRoomID];
    });


    socket.on('set name', function(name) {
        if( typeof name !== 'string' )
            return;

        name2rid[name] = myRoomID;
    });


    socket.on('update', function(features) {
        if( typeof features !== 'object' )
            return;

        var data = publisher[myRoomID];
        var keys = Object.keys(features);
        for(var i=0; i<keys.length; ++i)
            data[keys[i]] = features[keys[i]];

        io.to(myRoomID).emit('publisher updated', [myRoomID, data]);
    });


    socket.on('subscribe', function(name) {
        if( typeof name !== 'string' )
            return;

        var rid = name2rid[name] || name;
        socket.join(rid, function(err) {
            socket.emit('subscribe success', [rid, publisher[rid]]);
        });
    });


});




// Debugger
function analysisInfo() {
    console.log('\u001B[2J\u001B[0;0f');
    console.log(publisher)
    console.log(name2rid)
    
    const keys = Object.keys(name2rid);
    for(var i=0; i<keys.length; ++i) {
        var nowRoom = name2rid[keys[i]];
        if( !publisher[nowRoom] )
            continue;
        console.log('publisher : ' + keys[i]);
        console.log('subscriber : ' + io.nsps['/'].adapter.rooms[nowRoom]);
        console.log(JSON.stringify(publisher[nowRoom], null, '\t'));
    }
}
setInterval(analysisInfo, 1000);




http.listen(4444, function(){
    console.log('listening on *:4444');
});
