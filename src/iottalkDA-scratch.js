(function(ext) {


    // Include dependency
    var api = require('__iottalk_api.js');
    var SXregister = require('__scratchX-register.js');




    // Local cache
    var url = '';
    var devices = {}



    // Implement ScratchX function
    function setserver(_url, _port) {
        url = _url + ':' + _port;
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
        //
    }




    // Scratch extentions
    SXregister.add(setserver, ' ', 'set IoTtalk server %s %s', 'setserver', 'url', 'port');
    SXregister.add(create, ' ', 'create device %s by model %s', 'create', 'd_name', 'dm_name');
    SXregister.add(add, ' ', 'add feature %s to device %s', 'add', 'df_name', 'd_name');
    SXregister.add(register, 'w', 'register device %s', 'register', 'd_name');
    SXregister.add(detach, 'w', 'detach device %s', 'detach', 'd_name');
    SXregister.add(update, ' ', 'update device %s\'s feature %s[%s] = %s', 'update', 'd_name', 'df_name', 'key', 'val');
    SXregister.add(get, 'R', 'get device %s\'s feature %s[%s]', 'get', 'd_name', 'df_name', 'key');
    SXregister.ext._shutdown = function() {
        console.log('_shutdown');
    }



    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
