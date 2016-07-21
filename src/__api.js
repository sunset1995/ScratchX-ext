// Init socket
var io = require('socket.io-client')('http://snp2016.nctu.me:4444');

// Export to global for debug
window.io = io;




// Sync only subscribed with server
var localCache = {};
var toBeUpdated = {};


// Binding socket
io.on('subscribe success', function(ret) {
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




// Export api
module.exports = {
    setName: function(name) {
        if( typeof name !== 'string' )
            return;
        io.emit('set name', name);
    },
    update: function(key, val) {
        if( !key )
            return;
        toBeUpdated[key] = val;
    },
    get: function(who, feature) {
        if( localCache[who] )
            return localCache[who][feature] || '';
        else {
            localCache[who] = {};
            io.emit('subscribe', who);
            return '';
        }
    },
}
