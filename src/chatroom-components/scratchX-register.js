var ext = {
    _shutdown: function() {},
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
        var bk = descriptor.blocks.length - 1;
        for(let i=4; i<arguments.length; ++i)
            bk.push(arguments[i]);
    },
    ext: ext,
    descriptor: descriptor,
};
