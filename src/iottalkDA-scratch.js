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

    // Update queue
    var updateThreshold = 200;
    var updateQueue = [];
    var updateSet = {};
    function checkQueue() {
        if( updateQueue.length ) {
            var d_name = updateQueue[0][0];
            var df_name = updateQueue[0][1];
            updateQueue.shift(1);
            delete updateSet[d_name + '__' + df_name];
            
            // Update remote server
            if( devices[d_name] && devices[d_name][df_name] ) {
                console.log(d_name)
                console.log(df_name)
                console.log(devices[d_name][df_name])
                api.update(url, d_name, df_name, devices[d_name][df_name]);
            }
        }

        setTimeout(checkQueue, updateThreshold);
    }
    setTimeout(checkQueue, 2000);




    // Self used function
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
        if( devices[d_name] && devices[d_name]['profile']['df_list'].indexOf(df_name)===-1 )
            devices[d_name]['profile']['df_list'].push(df_name);
    }

    function register(d_name, callback) {
        if( !devices[d_name] || url === '' )
            callback();
        else
            api.register(url, d_name, devices[d_name]['profile'], callback);
    }

    function detach(d_name, callback) {
        if( url === '' )
            callback();
        else
            api.detach(url, d_name, callback);
    }

    function update(d_name, df_name, key, val) {
        if( url === '' )
            return;

        if( !devices[d_name] )
            devices[d_name] = {};
        if( !devices[d_name][df_name] )
            devices[d_name][df_name] = []
        devices[d_name][df_name][key] = val;

        if( !updateSet[d_name + '__' + df_name] ) {
            // Push to updateQueue
            updateQueue.push([d_name, df_name]);
            updateSet[d_name + '__' + df_name] = true;
        }
    }

    function get(d_name, df_name, key, callback) {
        if( url === '' ) {
            callback('server url not given');
            return;
        }

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
