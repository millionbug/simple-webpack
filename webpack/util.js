const fs = require('fs')
const path = require('path')
function completeFilePath(sourcePath) {
    if (!sourcePath.endsWith('.js')) {
        if (fs.existsSync(sourcePath + '.js')) {
            return sourcePath + '.js';
        } else if (fs.existsSync(sourcePath + '/index.js')) {
            return sourcePath + '/index.js';
        } else {
            throw new Error(`读取${sourcePath}时出错，检查是否存在`)
        }
    } else {
        return sourcePath;
    }
}

async function readFileWithHash(sourcePath) {
    return new Promise((resolve, reject) => {
        const fileStream = fs.createReadStream(sourcePath, 'utf-8');
        let data = '';
        fileStream.on('data', chunk => {
            console.log(sourcePath, '💐')
            data += chunk;
        });
        fileStream.on('end', () => {
            resolve([data, '']);
        })
    });
}

/**
 * 根据用户在代码中的引用，生成相对根目录的绝对路径
 *
 * @export
 * @param {*} source
 */
function getRootPath (dirpath, moduleName, root) {
    console.log('🧱', dirpath, moduleName, root)
    let result = '';
    if (/^[a-zA-Z\$_][a-zA-Z\d_]*/.test(moduleName)) {
      // 如果模块名满足一个变量的正则，说明引用的是node模块
      result = './node_modules/' + moduleName
    } else {
      result = './'
      + path.relative(root, path.resolve(dirpath, moduleName))
      + (path.extname(moduleName).length === 0 ? '.js' : '')
    }
    console.log(result, '墙🧱')
    return result;
}

exports.getRootPath = getRootPath;
exports.readFileWithHash = readFileWithHash;
exports.completeFilePath = completeFilePath;