// Init socket
var socketio = require('socket.io-client')
var io = null;




// Sync only subscribed with server
var localCache = {};
var toBeUpdated = {};


// Can be called once and only once
function initServer(name, url, callback) {
    if( io || !url ) {
        callback();
        callback = null;
        return;
    }
    io = socketio(url);
    window.io = io;
    console.log('Connecting to', url);

    // Binding socket
    io.on('connect_error', function() {
        console.log('connect error');
        io.close();
        io = null;
        if( typeof callback === 'function' ) {
            callback();
            callback = null;
        }
    });

    io.on('connect', function() {
        console.log('Connection success');
        io.emit('set name', name);
        if( typeof callback === 'function' ) {
            callback();
            callback = null;
        }
    });

    io.on('disconnect', function() {
        io.close();
        io = null;
    });

    io.on('subscribe success', function(ret) {
        console.log('subscribe success', ret);
        var who = ret[0];
        var features = ret[1];
        localCache[who] = features;
    });

    io.on('publisher updated', function(ret) {
        var who = ret[0];
        var features = ret[1];
        localCache[who] = features;
    });


    // Check whether need to trigger update or not
    var fps = 30;
    var interval = 1000 / fps;

    var lastTimestamp = null;
    var requestID = null;
    function sender(timestamp) {
        if( lastTimestamp===null )
            lastTimestamp = timestamp;
        if( timestamp-lastTimestamp > interval ) {
            if( Object.keys(toBeUpdated).length > 0 ) {
                io.emit('update', toBeUpdated);
                toBeUpdated = {};
            }
            lastTimestamp = timestamp;
        }
        requestID = requestAnimationFrame(sender);
    }
    requestID = requestAnimationFrame(sender);
}




// Export api
module.exports = {
    initServer: initServer,
    connectSuccess: function() {
        return io !== null? 1 : 0;
    },
    update: function(key, val) {
        if( !io || !key )
            return;
        toBeUpdated[key] = val;
    },
    get: function(who, feature) {
        if( !io )
            return '';
        else if( localCache[who] )
            return localCache[who][feature] || '';
        else {
            localCache[who] = {};
            io.emit('subscribe', who);
            return '';
        }
    },
}
