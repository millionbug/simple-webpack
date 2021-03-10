const core = require('@babel/core')
const fs = require('fs')

let i = 1;
function babelLoader (source, option) {
    console.log(source, '🐘')
    let res = core.transform(source, {
        sourceType: 'module'
    });
    if (i > 0) {
        fs.writeFileSync('./test.js', res.code);
        i--;
    }
    return res.code;
}

module.exports = babelLoader;
