const path = require("path");
const html = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const sveltePreprocess = require("svelte-preprocess");

module.exports = {
    mode: 'development',
    entry: ".\\src\\main.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devServer: {
        contentBase: './dist',
    },
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            },
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        emitCss: true,
                        preprocess: sveltePreprocess({})
                    },
                },
            },
            {
                test: /\.(scss|sass|css)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            }
        ]
    },
    plugins:
        [
            new html({ title: 'Tasks' }),
            new MiniCssExtractPlugin()
        ]
};