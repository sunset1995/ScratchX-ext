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
        descriptor.blocks = [opCode, label, methodName];
        for(var i=4; i<arguments.length; ++i)
            descriptor.blocks.push(arguments[i]);
    },
    ext: ext,
    descriptor: descriptor,
}
