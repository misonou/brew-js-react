const { createBaseWebpackConfig, createUMDExternal, createUMDLibraryDefinition, getPaths } = require('@misonou/build-utils');
const paths = getPaths();

module.exports = {
    ...createBaseWebpackConfig(),
    entry: {
        'brew-js-react': './src/entry.js',
        'brew-js-react.min': './src/entry.js',
    },
    output: {
        path: paths.dist,
        filename: '[name].js',
        library: createUMDLibraryDefinition('brew-js-react', 'brew.react', '*')
    },
    resolve: {
        alias: {
            '@misonou/react-dom-client': '@misonou/react-dom-client/fallback.js'
        }
    },
    externals: {
        'react': createUMDExternal('react', 'React'),
        'react-dom': createUMDExternal('react-dom', 'ReactDOM'),
        'jquery': createUMDExternal('jquery', 'jQuery'),
        'waterpipe': 'waterpipe',
        'zeta-dom-react': createUMDExternal('zeta-dom-react', 'zeta.react')
    }
};
