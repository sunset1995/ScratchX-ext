(function(ext) {


    // Include dependency
    var api = require('__api.js');
    var SXregister = require('__scratchX-register.js');

    // Init socket
    api.joinRoom('chatroom-example');




    // Implement scratchX extenion
    function update(key, val, callback) {
        if( key )
            api.update(key, val);
        callback();
    }

    function broadcast(signal, callback) {
        if( signal )
            api.broadcast(signal);
        callback();
    }

    function isExist(sid) {
        return api.isExist(sid);
    }

    function get(sid, key) {
        return api.get(sid, key);
    }

    function sidListSize(callback) {
        callback(api.sidListSize());
    }

    function sidListFind(ith) {
        return api.sidListFind(ith);
    }
    



    // Scratch extentions
    SXregister.add(update, 'w', 'update %s %s', 'feature', 'val');
    SXregister.add(broadcast, 'w', 'broadcast %s', 'signal');
    SXregister.add(isExist, 'r', 'is %s exist', 'id');
    SXregister.add(get, 'r', 'get %s %s', 'id', 'feature');
    SXregister.add(sidListSize, 'R', 'member list size');
    SXregister.add(sidListFind, 'r', 'get %d th\'s member id', 0);




    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
