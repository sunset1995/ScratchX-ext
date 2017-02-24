(function(ext) {


    // Include dependency
    var dan2 = require('__dan2.js');
    var SXregister = require('__scratchX-register.js');




    // Remote server url
    var idf = {};
    var odf = {};




    // Self used function
    function detach(callback) {
        console.log('TODO: detach');
    }
    function on_signal(cmd, param) {
        console.info('[cmd]', cmd, param);
        return true;
    }
    function on_data(idf_name, data) {
        odf = data
    }

    // Implement ScratchX function
    function setserver(name, ip, callback) {
        var url = 'http://' + ip + ':9992';
        var init_callback = function(result) {
            console.info('register:', result);
            callback();
        }

        dan2.register(url, {
            'mqtt_host': ip.toString(),
            'mqtt_port': 1884,
            'name': name.toString(),
            'on_signal': on_signal,
            'on_data': on_data,
            'idf_list': [
                ['ScratchX_input', ['object']],
                ['ScratchX_output', ['object']],
            ],
            'profile': {
                'model': 'ScratchX',
            },
            'accept_protos': ['mqtt'],
        }, init_callback);
    }

    function isConnected(callback) {
        callback(dan2.connected());
    }

    function updateStr(key, val, callback) {
        idf[key] = val.toString();
        dan2.push('ScratchX_input', [idf]);
        callback();
    }

    function updateNum(key, val, callback) {
        idf[key] = Number(val) || 0;
        dan2.push('ScratchX_input', [idf]);
        callback();
    }

    function get(key, callback) {
        if( typeof odf !== 'object' ) {
            callback(odf);
            return;
        }

        if( typeof odf[parseInt(key, 10)] !== 'undefined' )
            callback(odf[parseInt(key, 10)]);
        else if( typeof odf[key] !== 'undefined' )
            callback(odf[key]);
        else
            callback(0);
    }




    // Scratch extentions
    SXregister.add(setserver, 'w', '我叫 %s 註冊至 %s', 'name', 'ip');
    SXregister.add(isConnected, 'R', '已連線');
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
