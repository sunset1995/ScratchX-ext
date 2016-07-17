(function(ext) {


    // Init socket
    var io = require('socket.io-client')('http://snp2016.nctu.me:4444');
    
    // Export to global for debug
    window.io = io;




    // Room datas
    // ScratchX don't directly read remote data,
    // instead, read locally.
    var minnasan = {};




    // Binding socket
    io.on('join room success', function(roomData) {
        console.log(roomData);
        minnasan = roomData;
        io.off('join room success');
    });
    io.on('member exit', function(sid) {
        console.log(sid);
        delete minnasan[sid];
    });
    io.on('member join', function(sid) {
        console.log(sid);
        minnasan[sid] = {};
    });
    io.on('member updated', function(op) {
        console.log(op);
        var sid = op[0];
        var key = op[1];
        var val = op[2];
        if( !minnasan[sid] )
            return;
        minnasan[sid][key] = val;
    });
    io.on('member broadcast', function(msg) {
        console.log(msg);
        // TODO
    });

    // Start using sync room data
    io.emit('join room', 'chatroom-example');




    // Implement scratchX extenion
    function update(key, val, callback) {
        if( key )
            io.emit('update', [key, val]);
        callback();
    }

    function broadcast(signal, callback) {
        if( signal )
            io.emit('broadcast', signal);
        callback();
    }

    function isExist(sid) {
        if( minnasan[sid] )
            return 1;
        else
            return 0;
    }

    function get(sid, key) {
        if( minnasan[sid] )
            return minnasan[sid][key] || '';
        else
            return '';
    }

    function roomSize() {
        return Object.keys(minnasan).length;
    }

    function getId(ith) {
        // Same ith id will change after member change
        return Object.keys(minnasan)[ith] || '';
    }
    



    // Scratch extentions
    var SXregister = require('chatroom-components/scratchX-register.js');
    SXregister.add(update, 'w', 'update %s %s', 'update', 'feature', 'val');
    SXregister.add(broadcast, 'w', 'broadcast %s', 'broadcast', 'signal');
    SXregister.add(isExist, 'r', 'is %s exit', 'isExist', 'id');
    SXregister.add(get, 'r', 'get %s %s', 'get', 'id', 'feature');
    SXregister.add(roomSize, 'r', 'room size', 'roomSize');
    SXregister.add(getId, 'r', 'get %d th\'s id', 'getId', 0);




    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
