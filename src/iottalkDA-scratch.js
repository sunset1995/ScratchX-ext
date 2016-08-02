(function(ext) {


    // Include dependency
    var api = require('__iottalk_api.js');
    var SXregister = require('__scratchX-register.js');




    // Remote server url
    var url = '';

    // Local cache
    var devices = {};

    // Get data threshold
    var getThreshold = 200;
    var getTimestamp = Date.now();




    // self used function
    function __report(d_name, df_name, key, callback) {
        if( !devices[d_name] )
            callback('device instance not exist');
        else if( !devices[d_name][df_name] )
            callback('device feature not exist');
        else if( typeof devices[d_name][df_name] === 'object' ) {
            if( typeof devices[d_name][df_name][parseInt(key, 10)] !== 'undefined' )
                callback(devices[d_name][df_name][parseInt(key, 10)]);
            else if( typeof devices[d_name][df_name][key.toString()] !== 'undefined' )
                callback(devices[d_name][df_name][key.toString()]);
            else
                callback(-1);
        }
        else
            callback(devices[d_name][df_name]);
    }

    // Implement ScratchX function
    function setserver(ip, port) {
        url = 'http://' + ip + ':' + port;
    }

    function create(d_name, dm_name) {
        devices[d_name] = {
            'profile': {
                'd_name': d_name,
                'dm_name': dm_name,
                'is_sim': false,
                'df_list': [],
            }
        };
    }

    function add(df_name, d_name){
        if( devices[d_name] )
            devices[d_name]['profile']['df_list'].push(df_name);
    }

    function register(d_name, callback) {
        if( !devices[d_name] || url === '' )
            callback();
        else
            api.register(url, d_name, devices[d_name]['profile'], callback);
    }

    function detach(d_name, callback) {
        api.detach(url, d_name, callback);
    }

    function update(d_name, df_name, key, val) {
        //
    }

    function get(d_name, df_name, key, callback) {
        if( Date.now() - getTimestamp <= getThreshold ) {
            // Use local cache data
            __report(d_name, df_name, key, callback);
        }
        else {
            // Sync with remote data
            getTimestamp = Date.now();
            try {
                api.get(url, d_name, df_name, function(ret) {
                    // Update local cache
                    if( !devices[d_name] )
                        devices[d_name] = {};
                    devices[d_name][df_name] = ret;

                    __report(d_name, df_name, key, callback);
                });
            }
            catch(e) {
                callback('js bug, plase report to github');
            }
        }
    }




    // Scratch extentions
    SXregister.add(setserver, ' ', 'set IoTtalk server %s %s', 'setserver', 'ip', 'port');
    SXregister.add(create, ' ', 'create device %s by model %s', 'create', 'd_name', 'dm_name');
    SXregister.add(add, ' ', 'add feature %s to device %s', 'add', 'df_name', 'd_name');
    SXregister.add(register, 'w', 'register device %s', 'register', 'd_name');
    SXregister.add(detach, 'w', 'detach device %s', 'detach', 'd_name');
    SXregister.add(update, ' ', 'update device %s\'s feature %s %s = %s', 'update', 'd_name', 'df_name', 'key', 'val');
    SXregister.add(get, 'R', 'get device %s\'s feature %s %d', 'get', 'd_name', 'df_name', '0');




    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
