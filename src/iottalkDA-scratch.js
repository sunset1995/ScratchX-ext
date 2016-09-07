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
                callback(0);
        }
        else
            callback(cache['ScratchX_output']);
    }

    // Implement ScratchX function
    function setserver(ip, callback) {
        if( url === '' && id === '' ) {
            url = 'http://' + ip + ':9999';
            api.getDeviceName(url, function(ret) {
                id = ret;

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
            });
        }
        else
            callback();
    }

    function getname() {
        return id;
    }

    function detach(callback) {
        if( url !== '' ) {
            url = '';
            id = '';
            d_name = '';
            cache = null;
            api.detach(url, id, callback);
        }
        else if( typeof callback === 'function' )
            callback();
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
        val = Number(val) || 0;

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
    SXregister.add(setserver, 'w', 'set IoTtalk server url %s', 'ip');
    SXregister.add(getname, 'r', 'my device name');
    SXregister.add(updateStr, 'w', 'update %s = %s', 'key', 'val');
    SXregister.add(updateNum, 'w', 'update %s = %d', 'key', '0');
    SXregister.add(get, 'R', 'get %s', 'key');



    ScratchExtensions.register(
        'IoTtalk extension',
        SXregister.descriptor,
        SXregister.ext);
    



    // Detach when close
    window.onunload = detach;
    window.onbeforeunload = detach;
    window.onclose = detach;
    window.onpagehide = detach;


})({});
