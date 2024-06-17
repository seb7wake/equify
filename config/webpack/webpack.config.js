const { generateWebpackConfig } = require("shakapacker");
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpackConfig = generateWebpackConfig();

// Optimize CSS loading and extraction
webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: [
    MiniCssExtractPlugin.loader, // Extracts CSS into separate files
    "css-loader", // Translates CSS into CommonJS
    "sass-loader", // Compiles Sass to CSS
  ],
});

// Enable code splitting
webpackConfig.optimization = {
  splitChunks: {
    chunks: "all",
  },
  minimize: true,
  minimizer: [new TerserPlugin()],
};

// Enable long-term caching
webpackConfig.output = {
  filename: "[name].[contenthash].js",
  path: path.resolve(__dirname, "../../public/packs"),
  publicPath: "/packs/",
};

// Add plugins
webpackConfig.plugins.push(
  new MiniCssExtractPlugin({
    filename: "[name].[contenthash].css",
  }),
  new CleanWebpackPlugin() // Cleans output.path directory before each build
);

webpackConfig.mode = "production";
webpackConfig.devtool = "source-map";
webpackConfig.resolve.extensions.push(".scss");
webpackConfig.resolve.extensions.push(".sass");
webpackConfig.resolve.extensions.push(".ts");
webpackConfig.resolve.extensions.push(".tsx");

// Entry point configuration
webpackConfig.entry = {
  application: path.resolve(
    __dirname,
    "../../app/javascript/packs/application.js"
  ),
};

module.exports = webpackConfig;
