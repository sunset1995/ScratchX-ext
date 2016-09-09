(function(ext) {


    // Include dependency
    var api = require('__api.js');
    var SXregister = require('__scratchX-register.js');




    // Implement scratchX extenion
    function initServer(url, callback) {
        api.initServer(url);
        callback();
    }

    function setName(name, callback) {
        api.setName(name);
        callback();
    }

    function update(feature, val, callback) {
        api.update(feature, val);
        callback();
    }

    function get(who, feature) {
        return api.get(who, feature);
    }
    



    // Scratch extentions
    SXregister.add(initServer, 'w', 'init server %s', 'server url');
    SXregister.add(setName, 'w', 'set my name as %s', 'scratchX');
    SXregister.add(update, 'w', 'update %s %s', 'feature', 'val');
    SXregister.add(get, 'r', 'get %s %s', 'who', 'feature');




    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
