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
    'add': function(func, opCode, label) {
        var randomKey = Math.random().toString();
        ext[randomKey] = func;
        descriptor.blocks.push([opCode, label, randomKey]);
        var id = descriptor.blocks.length - 1;
        for(let i=3; i<arguments.length; ++i)
            descriptor.blocks[id].push(arguments[i]);
    },
    ext: ext,
    descriptor: descriptor,
};
