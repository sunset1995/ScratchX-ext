(function(ext) {



    // Init socket
    var io = require('socket.io-client')('http://snp2016.nctu.me:4444');
    // Export to global
    window.io = io;




    // Message queue closure
    var msgQueue = (function() {
        // no queue in native js, use hash instead
        var msgQueue = {};
        var top = -1;
        var tail = 0;
        var size = 0;
        return {
            size: function() {
                return size;
            },
            push: function(text) {
                msgQueue[++top] = text;
                ++size;
                console.log([top, tail, size])
            },
            pop: function() {
                if( size==0 )
                    return -1;
                --size;
                var ret = msgQueue[tail];
                delete msgQueue[tail];
                ++tail;
                console.log([top, tail, size])
                console.log(ret)
                return ret;
            },
        }
    })();

    io.on('someOneSay', function(text) {
        console.log(text);
        msgQueue.push(text);
    });




    // Send message to server
    function say(text, callback) {
        io.emit('sayToAll', text);
        callback();
    };

    // Whether there is message in queue
    function msgQueueSize() {
        return msgQueue.size();
    }

    // Get message from queue
    function msgQueuePop(text) {
        return msgQueue.pop();
    }




    // Scratch extentions
    var ext = {
        _shutdown: function() {},
        _getStatus: function() {
            return {status: 2, msg: 'Ready'};
        },
        say: say,
        msgQueueSize: msgQueueSize,
        msgQueuePop: msgQueuePop,
    };

    var descriptor = {
        blocks: [
            ['w', 'Say %s', 'say', "Hello, snp2016!"],
            ['r', 'Message queue size', 'msgQueueSize'],
            ['r', 'Message queue pop', 'msgQueuePop'],
        ]
    };

    ScratchExtensions.register('Chatroom extension', descriptor, ext);


})({});
