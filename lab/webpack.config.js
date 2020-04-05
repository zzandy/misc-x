const path = require("path");
const html = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: ".\\src\\main.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        //      publicPath: "/"
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
            //new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ["dist/*"] }),
            //new CleanWebpackPlugin(),
            new html({title: 'Labirinth'})//{ template: "./src/index.html" })
        ]
};