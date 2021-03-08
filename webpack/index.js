const Compiler = require('./compiler.js');

function wwebpack (options, errHandle) {
    const compiler = new Compiler(options);
    // 开始编译
    compiler.run();
}

module.exports = wwebpack;
