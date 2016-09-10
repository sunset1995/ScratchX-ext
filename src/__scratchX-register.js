var ext = {
    _getStatus: function() {
        return {status: 2, msg: 'Ready'};
    },
};

var descriptor = {
    blocks: [
    ],
};

var __cnt = 0;

module.exports = {
    'add': function(func, opCode, label) {
        ext[__cnt.toString()] = func;
        descriptor.blocks.push([opCode, label, __cnt.toString()]);
        var id = descriptor.blocks.length - 1;
        for(let i=3; i<arguments.length; ++i)
            descriptor.blocks[id].push(arguments[i]);

        ++__cnt;
    },
    ext: ext,
    descriptor: descriptor,
};
