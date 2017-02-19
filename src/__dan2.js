var mqtt = require('mqtt')
var _url;
var _id;
var _mqtt_host;
var _mqtt_port;
var _mqtt_client;
var _i_chans;
var _o_chans;
var _on_signal;
var _on_data;
var _rev;

function ChannelPool () {
    this._table = {};
    this._rtable = {};
    this.add = function (df_name, topic_) {
        this._table[df_name] = topic_;
        this._rtable[topic_] = df_name;
    };
    this.topic = function (df_name) {
        return this._table[df_name];
    };
    this.remove_df = function (df_name) {
        delete this._rtable[this._table[df_name]];
        delete this._table[df_name];
    };
    this.df = function (topic_) {
        return this._rtable[topic_];
    };
}

function publish (channel, message, retained) {
    if (!_mqtt_client) {
        return;
    }
    _mqtt_client.publish(channel, message, { 'retain': retained })
}

function subscribe (channel) {
    if (!_mqtt_client) {
        return;
    }
    _mqtt_client.subscribe(channel);
}

function unsubscribe (channel) {
    if (!_mqtt_client) {
        return;
    }
    _mqtt_client.unsubscribe(channel);
}

function on_message (msg) {
    var topic = msg.destinationName;
    var message = msg.payloadString;
    if (topic == _o_chans.topic('ctrl')) {
        var signal = JSON.parse(message);
        switch (signal['command']) {
        case 'CONNECT':
            if ('idf' in signal) {
                var idf = signal['idf'];
                _i_chans.add(idf, signal['topic']);
                var handling_result = _on_signal(signal['command'], [idf]);

            } else if ('odf' in signal) {
                var odf = signal['odf'];
                _o_chans.add(odf, signal['topic']);
                var handling_result = _on_signal(signal['command'], [odf]);
                subscribe(_o_chans.topic(odf));
            }
            break;
        case 'DISCONNECT':
            if ('idf' in signal) {
                var idf = signal['idf'];
                _i_chans.remove_df(idf);
                var handling_result = _on_signal(signal['command'], [idf]);

            } else if ('odf' in signal) {
                var odf = signal['odf'];
                unsubscribe(_o_chans.topic(odf));
                _o_chans.remove_df(odf);
                var handling_result = _on_signal(signal['command'], [odf]);
            }
            break;
        }
        var res_message = {
            'msg_id': signal['msg_id'],
        }
        if (typeof handling_result == 'boolean' && handling_result) {
            res_message['state'] = 'ok';
        } else {
            res_message['state'] = 'error';
            res_message['reason'] = handling_result[1];
        }
        publish(_i_chans.topic('ctrl'), JSON.stringify(res_message));
    } else {
        var odf = _o_chans.df(topic);
        if (!odf) {
            return;
        }
        _on_data(odf, JSON.parse(message));
    }
}

function UUID () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function register (url, params, callback) {
    _url = url;
    _id = ('id' in params) ? params['id'] : UUID();
    _mqtt_host = ('mqtt_host' in params) ? params['mqtt_host'] : location.hostname;
    _mqtt_port = ('mqtt_port' in params) ? params['mqtt_port'] : 9001;
    _on_signal = params['on_signal'];
    _on_data = params['on_data'];
    _i_chans = new ChannelPool();
    _o_chans = new ChannelPool();

    function on_failure (err) {
        if (callback) {
            callback(false, err);
        }
    }

    $.ajax({
        'type': 'PUT',
        'url': _url +'/'+ _id,
        'data': JSON.stringify({
            'name': params['name'],
            'idf_list': params['idf_list'],
            'odf_list': params['odf_list'],
            'accept_protos': params['accept_protos'],
            'profile': params['profile'],
        }),
        'contentType': 'application/json',
        'crossDomain': true,
    }).done(function (metadata) {
        if (typeof metadata === 'string') {
            metadata = JSON.parse(metadata);
        }

        _i_chans.add('ctrl', metadata['ctrl_chans'][0]);
        _o_chans.add('ctrl', metadata['ctrl_chans'][1]);
        _rev = metadata['rev'];

        function on_connect () {
            console.log('on_connect')
            console.log(callback)
            publish(
                _i_chans.topic('ctrl'),
                JSON.stringify({'state': 'online', 'rev': _rev}),
                true
            );
            subscribe(_o_chans.topic('ctrl'));
            if (callback) {
                callback({
                    'raproto': _url,
                    'mqtt': metadata['url'],
                    'id': _id,
                });
            }
        }

        _mqtt_client = mqtt.connect('mqtt://'+_mqtt_host+':'+_mqtt_port, {
            'clientId': _id,
            'will': {
                'topic': _i_chans.topic('ctrl'),
                'payload': JSON.stringify({'state': 'broken', 'rev': _rev}),
                'retain': true,
            },
        });
        _mqtt_client.on('connect', on_connect);
        _mqtt_client.on('reconnect', function() { console.info('reconnect') });
        _mqtt_client.on('error', function(err) { console.info('error', err) });
        _mqtt_client.on('message', function(topic, message, packet) {
            on_message({
                'destinationName': topic,
                'payloadString': message.toString()
            });
        });
    }).fail(function(err) {
        console.error('fail', err)
        on_failure(false, err);
    });
}

function push (idf_name, data) {
    if (!_mqtt_client || !_i_chans.topic(idf_name)) {
        return;
    }
    publish(_i_chans.topic(idf_name), JSON.stringify(data));
}

module.exports = {
    'register': register,
    'push': push,
    'UUID': function() {
        return _id;
    },
};
