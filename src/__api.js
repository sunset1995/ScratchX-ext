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
    var nowid = 0;
    var allSid = {};
    var back = {};

    function insert(sid) {
        allSid[nowid] = sid;
        back[sid] = nowid;
        ++nowid;
    }

    function remove(sid) {
        delete allSid[back[sid]];
        delete back[sid];
    }

    function find(ith) {
        return allSid[ith] || 'EXITED';
    }

    function maxId() {
        return nowid;
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

    console.log('=== join room success ===');
    console.log(roomData);
    console.log('=========================');
});

io.on('member exit', function(sid) {
    sidSet.remove(sid);
    delete minnasan[sid];

    console.log('====== member exit ======');
    console.log(sid);
    console.log('=========================');
});

io.on('member join', function(sid) {
    sidSet.insert(sid);
    minnasan[sid] = {};

    console.log('====== member join ======');
    console.log(sid);
    console.log('=========================');
});

io.on('member updated', function(op) {
    var sid = op[0];
    var key = op[1];
    var val = op[2];
    if( !minnasan[sid] )
        return;
    minnasan[sid][key] = val;

    console.log('==== member updated =====');
    console.log(op);
    console.log('=========================');
});

io.on('member broadcast', function(msg) {
    console.log(msg);
    // TODO
});





// Export api
module.exports = {
    joinRoom: function(roomName) {
        io.emit('join room', roomName);
    },
    update: function(key, val) {
        if( key )
            io.emit('update', [key, val]);
    },
    broadcast: function(signal) {
        if( signal )
            io.emit('broadcast', signal);
    },
    isExist: function(sid) {
        if( minnasan[sid] )
            return 1;
        else
            return 0;
    },
    get: function(sid, key) {
        if( minnasan[sid] )
            return minnasan[sid][key] || '';
        else
            return '';
    },
    sidListSize: function() {
        return sidSet.maxId();
    },
    sidListFind: function(ith) {
        return sidSet.find(ith);
    },
}
