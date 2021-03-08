// 这里直接用import会不会报错啊
const { completeFilePath, readFileWithHash, getRootPath } = require('./util');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
class Compilation {

    moduleMap = {};

    constructor(config) {
        this.entry = config.entry;
        this.loaders = config.loaders;
        this.root = config.root;
    }

    // 开始编译
    async make() {
        await this.moduleWalker(this.entry);
    }

    // dfs 遍历函数
    async moduleWalker(sourcePath) {
        if (sourcePath in this.moduleMap) return;
        sourcePath = completeFilePath(sourcePath);
        const [sourceCode, md5Hash] = await this.loadParser(sourcePath);

        const modulePath = getRootPath(this.root, sourcePath, this.root);

        // 获取编译后的模块代码，和模块内的依赖数组
        const [moduleCode, relyInModule] = this.parse(sourceCode, modulePath);
        this.moduleMap[modulePath] = moduleCode;
        if (relyInModule && relyInModule.length) {
            for (let i = 0, len = relyInModule.length; i < len; i++) {
                await this.moduleWalker(rely);
            }
        }
    }

    async loadParser(path) {
        let [codeContent, md5Hash] = await readFileWithHash(path);
        const { loaders } = this;
        for (let i = 0, len = loaders.length; i < len; i++) {
            const loaderItem = loaders[i];
            const {test, include, use} = loaderItem;
            // 判断loader是否满足匹配规则
        console.log(path, test, use, '🐟')

            if (path.match(test)) {
                // 如果loader是数组，则从最后一个开始调用
                // 这里简化规则，必须是数组
                if (Array.isArray(use)) {
                    const curr = use.pop();
                    let loaderFunc;
                    if (typeof curr.loader === 'string') {
                        loaderFunc = require(loader);
                    } else if (typeof curr.loader === 'function') {
                        loaderFunc = curr.loader;
                    } else {
                        loaderFunc = _ => _;
                    }
                    codeContent = loaderFunc(codeContent);
                }
            }
        }
        return [codeContent];
    }

    parse(sourceCode, modulePath) {
        // 分析 ast 词法树
        const ast = parser.parse(sourceCode);
        // 获取文件依赖的所有模块
        const relyInModule = [];

        traverse(ast, {
            // 找到有 import语法 的对应节点
            // 这里简化一下不处理require之类的语法了，编译原理实在没学过
            // CallExpression(p) {
            //     // 有些require是被_interopRequireDefault包裹的
            //     // 所以需要先找到_interopRequireDefault节点
            //     if (p.node.callee && p.node.callee.name === '_interopRequireDefault') {
            //       const innerNode = p.node.arguments[0]
            //       if (innerNode.callee.name === 'require') {
            //         inst.convertNode(innerNode, dirpath, relyInModule)
            //       }
            //     } else if (p.node.callee.name === 'require') {
            //       inst.convertNode(p.node, dirpath, relyInModule)
            //     }
            //   }
            ImportDeclaration: ({ node }) => {
                //把当前依赖的模块加入到数组中，其实这存的是字符串，
                //例如 如果当前js文件 有一句 import message from './message.js'， 
                //'./message.js' === node.source.value
                relyInModule.push(node.source.value);
            }
        });
        // 这里没有改写代码，直接返回sourcecode能行吗？
        return [sourceCode, modulePath];
    }

}

module.exports = Compilation;
