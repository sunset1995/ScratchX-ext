var ext = {
    _shutdown: function() {
        confirm('_shutdown');
    },
    _getStatus: function() {
        return {status: 2, msg: 'Ready'};
    },
};

var descriptor = {
    blocks: [
    ],
};

module.exports = {
    'add': function(func, opCode, label, methodName) {
        ext[methodName] = func;
        descriptor.blocks.push([opCode, label, methodName]);
        var id = descriptor.blocks.length - 1;
        for(let i=4; i<arguments.length; ++i)
            descriptor.blocks[id].push(arguments[i]);
    },
    ext: ext,
    descriptor: descriptor,
};
