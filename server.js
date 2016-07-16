console.log('Running server now...');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);




// Forward to course page anyway
app.get('*', function(req, res){
    res.redirect('https://github.com/mzshieh/snp2016');
});


var allRoomDatas = {
    'room name': {
        'each member sid': {
            'key': 'val',
        },
    },
};


// Processing socket for ScrathX
io.on('connection', function(socket){
  

    var sid = socket.id;
    var myRoom = {
        'name': null,
        'datas': {}
    };
    // Policy: member should joinRoom first
    var myData = null;
    
    console.log('Connecteion: ' + sid);
    sio.emit('memberJoin', sid);


    socket.on('disconnect', function() {
        if( myRoom.datas[sid] )
            delete myRoom.datas[sid];
        console.log('Disconnect : ' + sid);
        sio.emit('memberExit', sid);
    });


    socket.on('joinRoom', function(roomName) {
        if( typeof roomname !== 'string' )
            return;
        if( !allRoomDatas[roomName] )
            allRoomDatas[roomName] = {};

        myRoom.name = roomName;
        myRoom.datas = allRoomDatas[roomName];
        console.log('Join ' + roomName + ' : ' + sid);
        socket.join(roomName);
    });


    socket.on('update', function(key, val) {
        if( !myData || !key )
            return;
        myRoom.datas[sid][key] = val;
    });


    socket.on('updateThenBroadcast', function(key, val) {
        if( !myData || !key )
            return;
        myRoom[sid][key] = val;
        sio.emit('someoneUpdate', sid);
    });


    socket.on('broadcast', function(msg) {
        if( !myData || !msg )
            return;
        sio.emit('broadcast', msg);
    });


});




http.listen(4444, function(){
    console.log('listening on *:4444');
});
