(function(ext) {


    // Init socket
    var io = require('socket.io-client')('http://snp2016.nctu.me:4444');
    
    // Export to global for debug
    window.io = io;




    // Room datas
    // ScratchX don't directly read remote data,
    // instead, read locally.
    var minnasan = {};

    // Maintain ith user
    // For scratch to iterate through all sid only
    // Index of sid won't change in one session
    // Index order is not guarenteed in different application
    var sidSet = (function() {
        var maxId = 0;
        var allSid = {};
        var back = {};

        function insert(sid) {
            allSid[maxId] = sid;
            back[sid] = maxId;
            ++maxId;
            console.log(maxId);
        }

        function remove(sid) {
            delete allSid[back[sid]];
            delete back[sid];
        }

        function find(ith) {
            return allSid[ith] || 'EXITED';
        }

        function maxId() {
            console.log(maxId);
            return maxId;
        }

        return {
            insert: insert,
            remove: remove,
            find: find,
            maxId: maxId,
        };
    })();




    // Binding socket
    io.on('join room success', function(roomData) {
        minnasan = roomData;
        var keys = Object.keys(minnasan);
        for(var i=0; i<keys.length; ++i)
            sidSet.insert(keys[i]);
        io.off('join room success');

        console.log('join room success ' + roomData.toString());
    });

    io.on('member exit', function(sid) {
        sidSet.remove(sid);
        delete minnasan[sid];

        console.log('member exit ' + sid);
    });

    io.on('member join', function(sid) {
        sidSet.insert(sid);
        minnasan[sid] = {};

        console.log('member join ' + sid);
    });

    io.on('member updated', function(op) {
        var sid = op[0];
        var key = op[1];
        var val = op[2];
        if( !minnasan[sid] )
            return;
        minnasan[sid][key] = val;

        console.log('member updated ' + op.toStrin());
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

    function sidMaxId() {
        return sidSet.maxId();
    }

    function sidFind(ith) {
        return sidSet.find(ith);
    }
    



    // Scratch extentions
    var SXregister = require('chatroom-components/scratchX-register.js');
    SXregister.add(update, 'w', 'update %s %s', 'update', 'feature', 'val');
    SXregister.add(broadcast, 'w', 'broadcast %s', 'broadcast', 'signal');
    SXregister.add(isExist, 'r', 'is %s exist', 'isExist', 'id');
    SXregister.add(get, 'r', 'get %s %s', 'get', 'id', 'feature');
    SXregister.add(sidMaxId, 'r', 'member list size', 'sidMaxId');
    SXregister.add(sidFind, 'r', 'get %d th\'s member id', 'sidFind', 0);




    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
