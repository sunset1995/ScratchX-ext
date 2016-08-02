(function(ext) {


    // Include dependency
    var api = require('__iottalk_api.js');
    var SXregister = require('__scratchX-register.js');




    // Remote server url
    var url = '';
    var id = '';

    // Local cache
    var cache = null;

    // Get data threshold
    var getThreshold = 200;
    var getTimestamp = Date.now();

    // Update queue
    var updateThreshold = 200;
    var updateQueue = [];
    var updateSet = {};
    function checkQueue() {
        if( updateQueue.length ) {
            var id = updateQueue[0][0];
            updateQueue.shift(1);
            delete updateSet[id];
            
            // Update remote server
            if( cache && cache['ScratchX_output'] ) {
                console.log(id)
                console.log(cache['ScratchX_output'])
                api.update(url, id, 'ScratchX_output', cache['ScratchX_output']);
            }
        }

        setTimeout(checkQueue, updateThreshold);
    }
    setTimeout(checkQueue, 2000);




    // Self used function
    function __report(key, callback) {
        if( !cache || !cache['ScratchX_output'] )
            callback('not exist');
        else if( typeof cache['ScratchX_output'] === 'object' ) {
            if( typeof cache['ScratchX_output'][parseInt(key, 10)] !== 'undefined' )
                callback(cache['ScratchX_output'][parseInt(key, 10)]);
            else if( typeof cache['ScratchX_output'][key.toString()] !== 'undefined' )
                callback(cache['ScratchX_output'][key.toString()]);
            else
                callback(-1);
        }
        else
            callback(cache['ScratchX_output']);
    }

    // Implement ScratchX function
    function setserver(mac_addr, ip, port) {
        url = 'http://' + ip + ':' + port;
        id = mac_addr;
        cache = {
            'profile': {
                'd_name': 'ScratchX_' + id,
                'dm_name': 'ScratchX',
                'is_sim': false,
                'df_list': ['ScratchX_input', 'ScratchX_output'],
            }
        };

        if( url === '' )
            callback();
        else
            api.register(url, id, cache['profile'], callback);
    }

    function detach(callback) {
        if( url === '' )
            callback();
        else
            api.detach(url, id, callback);
    }

    function update(key, val) {
        if( url === '' || !cache )
            return;

        cache['ScratchX_output'][key] = val;

        if( !updateSet[id] ) {
            // Push to updateQueue
            updateQueue.push(id);
            updateSet[id] = true;
        }
    }

    function get(key, callback) {
        if( url === '' ) {
            callback('server url not given');
            return;
        }

        if( Date.now() - getTimestamp <= getThreshold ) {
            // Use local cache data
            __report(key, callback);
        }
        else {
            // Sync with remote data
            getTimestamp = Date.now();
            try {
                api.get(url, d_name, df_name, function(ret) {
                    // Update local cache
                    console.log(ret)
                    console.log(typeof ret)
                    cache['ScratchX_output'] = ret;

                    __report(key, callback);
                });
            }
            catch(e) {
                callback('js bug, plase report to github');
            }
        }
    }




    // Scratch extentions
    SXregister.add(setserver, 'w', 'register %s IoTtalk server %s %s', 'setserver', 'mac_addr', 'ip', 'port');
    SXregister.add(detach, 'w', 'detach device', 'detach');
    SXregister.add(update, ' ', 'update device %s = %s', 'updateStr', 'key', 'val');
    SXregister.add(update, ' ', 'update device %s = %d', 'updateNum', 'key', '0');
    SXregister.add(get, 'R', 'get %s', 'get', 'd_name', 'key');




    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
