const { environment } = require("@rails/webpacker");
const webpack = require("webpack");

// Add the required loaders for SCSS
environment.loaders.append("style", {
  test: /\.scss$/,
  use: ["style-loader", "css-loader", "sass-loader"],
});

module.exports = environment;
