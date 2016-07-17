console.log('Running server now...');

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);




// Forward to course page anyway
app.get('*', function(req, res){
    res.redirect('https://github.com/mzshieh/snp2016');
});




var storage = {
    'room name': {
        'each member sid': {
            'key': 'val',
        },
    },
};

// Processing socket for ScrathX
io.on('connection', function(socket){
  

    var sid = socket.id;

    // Policy: member should join room first
    var joined = false;
    var myRoom = {
        'name': null,
        'datas': {}
    };
    var myData = null;


    socket.on('disconnect', function() {
        if( !joined )
            return;

        delete myRoom.datas[sid];
        socket.leave(myRoom.name);
        io.to(myRoom.name).emit('member exit', sid);

        console.log(sid + ' exit ' + myRoom.name);
    });


    socket.on('join room', function(roomName) {
        if( joined || typeof roomName !== 'string' )
            return;
        joined = true;

        // If first member in room, init memory
        if( !storage[roomName] )
            storage[roomName] = {};

        myRoom.name = roomName;
        myRoom.datas = storage[roomName];
        myRoom.datas[sid] = {};
        myData = myRoom.datas[sid];
        
        socket.join(roomName);
        // Tell others I join
        socket.broadcast.to(roomName).emit('member join', sid);
        socket.emit('join room success', myRoom.datas);

        console.log(sid + ' join ' + roomName);
    });


    socket.on('update', function(key, val) {
        if( !joined || !key )
            return;
        myData[key] = val;
        io.to(myRoom.name).emit('member updated', [sid, key, val]);
    });


    socket.on('broadcast', function(msg) {
        if( !joined || !msg )
            return;
        io.to(myRoom.name).emit('member broadcast', msg);
    });


});




http.listen(4444, function(){
    console.log('listening on *:4444');
});
