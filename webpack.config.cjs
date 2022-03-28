const fs = require('fs');
const path = require('path');
const glob = require('glob');
const JavascriptParser = require('webpack/lib/javascript/JavascriptParser');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const srcPath = path.join(process.cwd(), 'src');
const outputPath = path.join(process.cwd(), 'dist');
const tmpPath = path.join(process.cwd(), 'tmp');

function processModule(module, options) {
    const includeUMDDir = path.join(tmpPath, module);
    const zetaDir = fs.existsSync(`../${module}`) ? path.resolve(`../${module}/src`) : path.resolve(`node_modules/${module}`);

    function getExportedNames(filename) {
        const parser = new JavascriptParser('module');
        const names = [];
        parser.hooks.export.tap('export', (statement) => {
            if (statement.type === 'ExportNamedDeclaration') {
                if (statement.declaration?.type === 'FunctionDeclaration') {
                    names.push(statement.declaration.id.name);
                } else {
                    names.push(...statement.specifiers.map(v => v.exported.name));
                }
            }
        });
        parser.parse(fs.readFileSync(filename, 'utf8'));
        return names;
    }

    function getExpressionForSubModule(subModule) {
        return options.subModuleExpressions[subModule];
    }

    function transformDeconstructName(subModule, name) {
        const alias = options.exportNameMappings[`${subModule}:${name}`];
        if (alias) {
            return `${alias}: ${name}`
        }
        return name;
    }

    if (!fs.existsSync(includeUMDDir)) {
        fs.mkdirSync(includeUMDDir, { recursive: true });
    }
    glob.sync(options.localPath + '/**/*.js').forEach((p) => {
        var filename = p.slice(options.localPath.length + 1);
        var output = `import lib from "${module}";`;
        var parser = new JavascriptParser('module');
        var handler = (statement, source) => {
            if (source.startsWith(module + '/')) {
                const subModule = source.slice(module.length + 1);
                switch (statement.type) {
                    case 'ExportAllDeclaration': {
                        let names = getExportedNames(path.join(zetaDir, `${subModule}.js`));
                        output += `const { ${names.map(v => transformDeconstructName(subModule, v)).join(', ')} } = ${getExpressionForSubModule(subModule)}; export { ${names.join(', ')} };`;
                        break;
                    }
                    case 'ExportNamedDeclaration': {
                        let names = statement.specifiers.map(v => v.local.name);
                        output += `const { ${names.map(v => transformDeconstructName(subModule, v)).join(', ')} } = ${getExpressionForSubModule(subModule)}; export { ${names.join(', ')} };`;
                        break;
                    }
                    case 'ImportDeclaration': {
                        output += `const _defaultExport = ${getExpressionForSubModule(subModule)}; export default _defaultExport;`;
                        break;
                    }
                }
            }
        };
        parser.hooks.import.tap('import', handler);
        parser.hooks.exportImport.tap('import', handler);
        parser.parse(fs.readFileSync(path.join(options.localPath, filename), 'utf8'));

        var dstPath = path.join(includeUMDDir, filename);
        if (!fs.existsSync(path.resolve(dstPath, '..'))) {
            fs.mkdirSync(path.resolve(dstPath, '..'));
        }
        fs.writeFileSync(dstPath, output);
    });
    return includeUMDDir;
}

const zetaDOMPath = processModule('zeta-dom', {
    localPath: path.join(srcPath, 'include/zeta-dom'),
    exportNameMappings: {
        'events:ZetaEventContainer': 'EventContainer'
    },
    subModuleExpressions: {
        cssUtil: 'lib.css',
        dom: 'lib.dom',
        domLock: 'lib.dom',
        observe: 'lib.dom',
        util: 'lib.util',
        domUtil: 'lib.util',
        events: 'lib',
        tree: 'lib',
        env: 'lib',
        index: 'lib'
    }
});
const brewJSPath = processModule('brew-js', {
    localPath: path.join(srcPath, 'include/brew-js'),
    exportNameMappings: {},
    subModuleExpressions: {
        'extension/router': 'lib',
        anim: 'lib',
        app: 'lib',
        core: 'lib',
        defaults: 'lib.defaults',
        domAction: 'lib',
        index: 'lib'
    }
});

module.exports = {
    entry: {
        'brew-js-react': './src/entry.js',
        'brew-js-react.min': './src/entry.js',
    },
    devtool: 'source-map',
    output: {
        path: outputPath,
        filename: '[name].js',
        library: 'brew-js-react',
        libraryTarget: 'umd',
        libraryExport: 'default',
        umdNamedDefine: true
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: [tmpPath]
        })
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                test: /\.min\.js$/i
            })
        ]
    },
    resolve: {
        alias: {
            'zeta-dom': zetaDOMPath,
            'brew-js': brewJSPath
        }
    },
    externals: {
        'react': {
            commonjs: 'react',
            commonjs2: 'react',
            amd: 'react',
            root: 'React'
        },
        'react-dom': {
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
            amd: 'react-dom',
            root: 'ReactDOM'
        },
        'jquery': 'jQuery',
        'waterpipe': 'waterpipe',
        'zeta-dom-react': 'zeta-dom-react',
        'zeta-dom': {
            commonjs: 'zeta-dom',
            commonjs2: 'zeta-dom',
            amd: 'zeta-dom',
            root: 'zeta'
        },
        'brew-js': {
            commonjs: 'brew-js',
            commonjs2: 'brew-js',
            amd: 'brew-js',
            root: 'brew'
        }
    }
};
