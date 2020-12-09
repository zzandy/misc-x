const path = require("path");
const html = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: ".\\src\\main.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
    },
    devServer:{
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
            }
        ]
    },
    plugins:
        [
            new html({title: 'Ideas'})
        ]
};