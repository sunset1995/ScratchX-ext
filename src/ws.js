(function(ext) {


    // Include dependency
    var api = require('__api.js');
    var SXregister = require('__scratchX-register.js');




    // Implement scratchX extenion
    function initServer(name, url, callback) {
        api.initServer(name, url, callback);
    }

    function connectSuccess() {
        return api.connectSuccess();
    }

    function update(feature, val) {
        api.update(feature, val);
    }

    function subscribe(who) {
        api.subscribe(who);
    }

    function get(who, feature) {
        return api.get(who, feature);
    }
    



    // Scratch extentions
    SXregister.add(initServer, 'w', '我叫 %s 連接至伺服器 %s', '某人', 'url');
    SXregister.add(connectSuccess, 'r', '成功連線');
    SXregister.add(update, ' ', '令 %s = %s', '屬性', '值');
    SXregister.add(subscribe, ' ', '訂閱 %s 的所有資訊', '某人');
    SXregister.add(get, 'r', '取得 %s %s 的值', '某人', '屬性');




    ScratchExtensions.register(
        'Websocket extension',
        SXregister.descriptor,
        SXregister.ext);


})({});
