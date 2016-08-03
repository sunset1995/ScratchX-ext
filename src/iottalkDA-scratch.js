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
    var updateFlag = false;
    function checkQueue() {
        if( updateFlag ) {
            // Update remote server
            if( cache && cache['ScratchX_input'] ) {
                updateFlag = false;
                api.update(url, id, 'ScratchX_input', [cache['ScratchX_input']]);
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
    function setserver(mac_addr, ip, port, callback) {
        url = 'http://' + ip + ':' + port;
        id = mac_addr;

        cache = {
            'profile': {
                'd_name': id,
                'dm_name': 'ScratchX',
                'is_sim': false,
                'df_list': ['ScratchX_input', 'ScratchX_output'],
            },
            'ScratchX_input': {},
            'ScratchX_output': 'nothing from server',
        };

        api.register(url, id, cache['profile'], callback);
    }

    function detach(callback) {
        if( url === '' )
            callback();
        else {
            url = '';
            id = '';
            cache = null;
            api.detach(url, id, callback);
        }
    }

    function updateStr(key, val, callback) {
        val = val.toString();

        if( !cache || !cache['ScratchX_input'] )
            callback('Please register first');
        else {
            cache['ScratchX_input'][key] = val;
            updateFlag = true;
            callback();
        }
    }

    function updateNum(key, val, callback) {
        val = Number(val) || -1;

        if( !cache || !cache['ScratchX_input'] )
            callback('Please register first');
        else {
            cache['ScratchX_input'][key] = val;
            updateFlag = true;
            callback();
        }
    }

    function get(key, callback) {
        if( url === '' ) {
            callback('Please register first');
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
                api.get(url, id, 'ScratchX_output', function(ret) {
                    // Update local cache
                    cache['ScratchX_output'] = ret[0];

                    __report(key, callback);
                });
            }
            catch(e) {
                callback('js bug, plase report issue');
            }
        }
    }




    // Scratch extentions
    SXregister.add(setserver, 'w', 'register %s to IoTtalk server %s %s', 'mac_addr', 'ip', 'port');
    SXregister.add(detach, 'w', 'detach device');
    SXregister.add(updateStr, 'w', 'update %s = %s', 'key', 'val');
    SXregister.add(updateNum, 'w', 'update %s = %d', 'key', '0');
    SXregister.add(get, 'R', 'get %s', 'key');



    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);
    



    // Detach when close
    SXregister.ext._shutdown = detach;
    window.onunload = detach;
    window.onbeforeunload = detach;
    window.onclose = detach;
    window.onpagehide = detach;


})({});
