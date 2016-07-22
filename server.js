const PORT = process.env.PORT || 4444;
const IP = process.env.IP || '0.0.0.0';


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
    var myName = myRoomID;
    publisher[myRoomID] = {};


    socket.on('disconnect', function() {
        delete publisher[myRoomID];
    });


    socket.on('set name', function(name) {
        if( typeof name !== 'string' )
            return;

        name2rid[name] = myRoomID;
        myName = name;
    });


    socket.on('update', function(features) {
        if( typeof features !== 'object' )
            return;

        var data = publisher[myRoomID];
        var keys = Object.keys(features);
        for(var i=0; i<keys.length; ++i)
            data[keys[i]] = features[keys[i]];

        io.to(myRoomID).emit('publisher updated', [myName, data]);
    });


    socket.on('subscribe', function(name) {
        if( typeof name !== 'string' )
            return;

        var rid = name2rid[name] || name;
        socket.join(rid, function(err) {
            if( !err )
                socket.emit('subscribe success', [name, publisher[rid]]);
        });
    });


});




// Debugger
function analysisInfo() {
    console.log('\u001B[2J\u001B[0;0f');
    
    const keys = Object.keys(name2rid);
    for(var i=0; i<keys.length; ++i) {
        var nowRoom = name2rid[keys[i]];
        if( !publisher[nowRoom] )
            continue;
        var members = io.nsps['/'].adapter.rooms[nowRoom] || {};
        console.log('============================================');
        console.log('publisher : ' + keys[i]);
        console.log('subscriber : ' + (members.length || 0));
        console.log(JSON.stringify(publisher[nowRoom], null, '\t'));
    }
}
setInterval(analysisInfo, 2000);




http.listen(PORT, IP, function(){
    console.log('listening on ' + IP + ':' + PORT);
});
