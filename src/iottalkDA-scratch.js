(function(ext) {


    // Include dependency
    var api = require('__iottalk_api.js');
    var SXregister = require('__scratchX-register.js');


    // Define shared variable
    var config = {
        url: null,
        mac: null,
        registered: false,
    };

    var data = {};

    const Df_name = 'Json_string';
    const profile = {
        'd_name': 'ScratchX',
        'dm_name': 'ScratchX',
        'is_sim': false,
        'df_list': [Df_name]
    };



    // Implement scratchX extenion
    function setServer(url) {
        config.url = url;
    }


    function register(mac, callback) {
        if( config.url === null || config.mac !== null ) {
            callback();
            return;
        }

        config.mac = mac;
        var cb = function() {
            config.registered = true;
            callback();
        };
        api.register(config.url, mac, profile, cb);
    }

    function update(key, val, callback) {
        data[key] = val;

        if( config.url === null ) {
            callback();
            return;
        }

        const udp = JSON.stringify(data);
        api.update(config.url, config.mac, Df_name, [udp], callback);
    }

    function get(mac, feature, key, callback) {
        if( config.url === null ) {
            callback();
            return;
        }

        var cb = function(ret) {
            console.log(ret)
            if( typeof ret !== 'object' || 
                    !ret['samples'] ||
                    !ret['samples'][0] ||
                    !ret['samples'][0][1] )
                callback(-1);
            else {
                console.log(ret['samples'][0][1]);
                var res = JSON.parse(ret['samples'][0][1]);
                console.log(res);
                console.log(key)
                callback(res[key] || -1);
            }
        };
        api.get(config.url, mac, feature, cb);
    }
    



    // Scratch extentions
    SXregister.add(setServer, ' ', 'set remote server as %s', 'setServer', 'url');
    SXregister.add(register, 'w', 'register mac address as %s', 'register', 'mac');
    SXregister.add(update, 'w', 'update %s %s', 'update', 'key', 'val');
    SXregister.add(get, 'R', 'get %s %s %s', 'get', 'mac', 'feature', 'key');
    SXregister._shutdown = function() {
        if( config.mac !== null )
            api.detach(config.url, config.mac);
    }



    ScratchExtensions.register(
        'Chatroom extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
