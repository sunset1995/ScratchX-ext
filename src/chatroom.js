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
        msgQueue.push(text);
    });




    // Send message to server
    function say(text, callback) {
        io.emit('sayToAll', text);
        callback();
    };

    // Regist name
    function registName(name) {
        io.emit('registName', name);
    }

    // Whether there is message in queue
    function msgQueueSize(callback) {
        callback(msgQueue.size());
    }

    // Get message from queue
    function msgQueuePop(callback) {
        callback(msgQueue.pop());
    }




    // Scratch extentions
    var SXregister = require('chatroom-components/scratchX-register.js');
    SXregister.add(say, 'w', 'Say %s', 'say', 'Hello, snp2016!');
    SXregister.add(registName, 'w', 'Regist my name as %s', 'registName');
    SXregister.add(msgQueueSize, 'R', 'Message queue size', 'msgQueueSize');
    SXregister.add(msgQueuePop, 'R', 'Message queue pop', 'msgQueuePop');




    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
