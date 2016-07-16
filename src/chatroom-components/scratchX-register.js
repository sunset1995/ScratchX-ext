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
        block = [opCode, label, methodName];
        for(var i=4; i<arguments.length; ++i)
            block.push(arguments[i]);
        descriptor.blocks.push(block);
        console.log(ext);
        console.log(descriptor)
    },
    ext: ext,
    descriptor: descriptor,
}
