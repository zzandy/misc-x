let CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/index.tsx',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },

    devtool: 'source-map',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json']
    },

    module: {
        rules: [
            { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
            { test: /\.js$/, loader: 'source-map-loader', enforce: 'pre' },
        ]
    },

    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: __dirname + '/src/index.html', to: __dirname + '/dist/index.html' },
            { from: __dirname + '/node_modules/react/dist/react.js', to: __dirname + '/dist/react.js' },
            { from: __dirname + '/node_modules/react-dom/dist/react-dom.js', to: __dirname + '/dist/react-dom.js' },
        ])
    ]
}