const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "none",
  entry: { main: "./simple/index.js" },
  output: {
    filename: "js/main.min.js",
    path: path.resolve(__dirname, "simple/output"),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  useBuiltIns: "usage", // "entry" = @babel/polyfill
                  corejs: { version: 3, proposals: true },
                },
              ],
            ],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          { loader: "css-loader", options: {
            url: false,
          } },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  [
                    "postcss-preset-env",
                    {
                      stage: 2,
                      browserslist: ["last 1 version", "> 1%", "IE 10"],
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(), // 进程
    new CleanWebpackPlugin(), // 清理dist
    new MiniCssExtractPlugin({
      filename: "css/style.min.css",
    }), // css提取
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin(), // 压缩js
    ],
  },
};
