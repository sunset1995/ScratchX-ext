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
        descriptor.blocks = [opCode, label, methodName].concat(arguments.slice(4));
    },
    ext: ext,
    descriptor: descriptor,
}
