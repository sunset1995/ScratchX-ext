function register(url, mac, profile, callback) {
    console.log(profile)
    $.ajax({
        type: 'POST',
        url: url + '/' + mac,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({'profile': profile}),
        success: function(res) {
            console.log(res);
            console.log('register success');
        },
        error: function(err, st) {
            console.log(err);
            console.log(st);
            console.log('register failed');
        },
        complete: function() {
            if( typeof callback === 'function' )
                callback();
        },
        dataType: 'text',
    });
}


function detach(url, mac, callback) {
    $.ajax({
        type: "DELETE",
        url: url + '/' + mac,
        success: function(res) {
            console.log(res);
            console.log('Detach success');
        },
        error: function(err, st) {
            console.log(err);
            console.log(st);
            console.log('Detach failed');
        },
        complete: function() {
            if( typeof callback === 'function' )
                callback();
        },
        dataType: 'text',
    });
}


function update(url, mac, feature, data, callback) {
    $.ajax({
        type: "PUT",
        url: url + '/' + mac + '/' + feature,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({'data': data}),
        success: function(res) {
            console.log(res);
            console.log('Update success');
        },
        error: function(err, st) {
            console.log(err);
            console.log(st);
            console.log('Update failed');
        },
        complete: function() {
            if( typeof callback === 'function' )
                callback();
        },
        dataType: 'text',
    });
}


function get(url, mac, feature, callback) {
    var ret = 0;
    $.ajax({
        type: "GET",
        cache: false,
        url: url + '/' + mac + '/' + feature,
        success: function(res) {
            ret = JSON.parse(res);
            if( typeof ret !== 'object' || 
                    !ret['samples'] ||
                    !ret['samples'][0] ||
                    !ret['samples'][0][1] )
                ret = [];
            else
                ret = ret['samples'][0][1];
            console.log(res);
            console.log('Get success');
        },
        error: function(err, st) {
            console.log(err);
            console.log(st);
            console.log('Get failed');
        },
        complete: function() {
            if( typeof callback === 'function' )
                callback(ret);
        },
        dataType: 'text',
    });   
}

function getDeviceName(url, callback) {
    console.log(url + '/tree')
    var ret = '';
    $.ajax({
        method: 'GET',
        cache: false,
        url: url + '/tree',
        success: function(res) {
            try {
                res = JSON.parse(res);
            }
            catch(e) {
                return;
            }
            var idx = 0;
            while( ++idx<10000 && res['SX_'+idx] )
                ;
            ret = 'SX_'+idx;
            console.log(ret);
        },
        error: function(err, st) {
            console.log(err);
            console.log(st);
            console.log('Get device name failed');
        },
        complete: function() {
            if( typeof callback === 'function' )
                callback(ret);
        },
        dataType: 'text',
    });
}




// Export to browser's global for debug
if( window ) {
    window.IoTtalk = {
        register: register,
        detach: detach,
        update: update,
        get: get,
        getDeviceName: getDeviceName,
    };
}

// Export api
module.exports = {
    register: register,
    detach: detach,
    update: update,
    get: get,
    getDeviceName: getDeviceName,
}
