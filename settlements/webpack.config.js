const path = require("path");
const html = require("html-webpack-plugin");
const clean = require("clean-webpack-plugin");

module.exports = {
    entry: ".\\src\\main.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
  //      publicPath: "/"
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
    plugins: [new clean(["dist/*"]), new html({ template: "./src/index.html" })]
};
