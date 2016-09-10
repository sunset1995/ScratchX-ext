const DEBUG = false;
const PORT = process.env.PORT || 4444;
var io = require('socket.io')(PORT);



// Mapping roomname -> {feature: val}
var publisher = {};

// Processing socket for ScrathX
io.on('connection', function(socket){
  

    var ID = socket.id;


    socket.on('disconnect', function() {
        delete publisher[ID];
    });


    socket.on('set name', function(name) {
        if( typeof name !== 'string' )
            return;

        delete publisher[ID];
        ID = name;
    });


    socket.on('update', function(features) {
        if( typeof features !== 'object' )
            return;

        if( !publisher[ID] )
            publisher[ID] = {};
        var data = publisher[ID];
        var keys = Object.keys(features);
        for(var i=0; i<keys.length; ++i)
            data[keys[i]] = features[keys[i]];

        io.to(ID).emit('publisher updated', [ID, data]);
    });


    socket.on('subscribe', function(name) {
        if( typeof name !== 'string' )
            return;

        socket.join(name, function(err) {
            if( !err )
                socket.emit('subscribe success', [name, publisher[name] || {}]);
        });
    });


});



// Debugger
function analysisInfo() {
    console.log('\u001B[2J\u001B[0;0f');
    
    const keys = Object.keys(publisher);
    for(var i=0; i<keys.length; ++i) {
        var members = io.nsps['/'].adapter.rooms[keys[i]] || {};
        console.log('============================================');
        console.log('publisher : ' + keys[i]);
        console.log('subscriber : ' + (members.length || 0));
        console.log(JSON.stringify(publisher[keys[i]], null, '\t'));
    }
}
if( DEBUG )
    setInterval(analysisInfo, 1000);
