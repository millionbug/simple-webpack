const { AsyncSeriesHook } = require('tapable'); // 此处我们创建了一些异步钩子
const Compilation = require('./compilation');
const { getRootPath } = require('./util');

class Compiler {
    constructor(config) {
        const {
            entry,
            output,
            module,
            plugins
        } = config;
        this.entryPath = entry;
        this.distPath = output.path;
        this.distName = output.fileName;
        this.loaders = module.rules;
        this.plugins = plugins;
        this.root = process.cwd();
    
        // 编译工具类Compilation
        this.compilation = {}
        // 入口文件在module中的相对路径，也是这个模块的id
        this.entryId = getRootPath(this.root, entry, this.root);

        this.mountPlugins();
    }
    
    // 注册所有的 plugin，原来注册不只是在宿主的生命周期中直接调用需要注册的方法plugin
    // 还有就是对plugin调用一个监听方法，宿主直接广播监听事件的。不过都差不多
    mountPlugins() {
        for(let i = 0, len = this.plugins.length; i < len; i++) {
            this.plugins[i].apply(this);
        }
    }
    
    hooks = {
        // 生命周期事件
        beforeRun: new AsyncSeriesHook(['compiler']), // compiler代表我们将向回调事件中传入一个compiler参数
        afterRun: new AsyncSeriesHook(['compiler']),
        beforeCompile: new AsyncSeriesHook(['compiler']),
        afterCompile: new AsyncSeriesHook(['compiler']),
        emit: new AsyncSeriesHook(['compiler']),
        failed: new AsyncSeriesHook(['compiler']),
    }

    async run() {
        // this.hooks.beforeRun.callAsync(this);
        this.compilation = new Compilation({
            root: this.root,
            entry: this.entryPath,
            loaders: this.loaders,
            hooks: this.hooks,
            distPath: this.distPath,
            distName: this.distName
        });
        await this.compilation.make();

    }
}

module.exports = Compiler;
