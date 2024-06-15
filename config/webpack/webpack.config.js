// See the shakacode/shakapacker README and docs directory for advice on customizing your webpackConfig.
const { generateWebpackConfig } = require("shakapacker");
const path = require("path");

const webpackConfig = generateWebpackConfig();

webpackConfig.module.rules.push({
  test: /\.scss$/,
  use: [
    "style-loader", // Injects styles into DOM
    "css-loader", // Translates CSS into CommonJS
    "sass-loader", // Compiles Sass to CSS
  ],
});

webpackConfig.mode = "production";
webpackConfig.devtool = "source-map";
webpackConfig.resolve.extensions.push(".scss");
webpackConfig.resolve.extensions.push(".sass");
webpackConfig.resolve.extensions.push(".ts");
webpackConfig.resolve.extensions.push(".tsx");

// webpackConfig.output = {
//   filename: "[name].js",
//   sourceMapFilename: "[name].js.map",
//   path: path.resolve(__dirname, "..", "..", "app/assets/builds"),
// };

webpackConfig.entry = {
  application: path.resolve(
    __dirname,
    "../../app/javascript/packs/application.js"
  ),
};

module.exports = webpackConfig;
