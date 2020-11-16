const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "none",
  entry: { main: "./src/js/main.js" },
  output: {
    filename: "js/[name].min.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "./",
  },
  // devtool: "inline-source-map", // 开启source map
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    // open: true,
    hot: true,
    liveReload: true,
    noInfo: true,
    clientLogLevel: "silent",
    host: "10.0.15.43",
    useLocalIp: true,
    port: 9000,
    proxy: {
      "/api": {
        target: "http://grayraven-jp.demo.herogame.com/",
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          "^/api": "",
        },
      },
    },
    after: function (app, server, compiler) {
      console.log(
        "\n-------------------------------------------------------------------"
      );
      console.log(
        `\nSuccessful startup, open address: http://${this.host}:${this.port}`
      );
      console.log(
        "\n-------------------------------------------------------------------"
      );
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"]],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "../",
            },
          },
          { loader: "css-loader", options: {} },
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
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: false,
              outputPath: "images/",
              esModule: false,
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "font/",
            },
          },
        ],
      },
      {
        test: /\.html$/i,
        loader: "html-loader",
        // exclude: /index.html$/,
        options: {
          attributes: {
            list: [
              {
                attribute: "src",
                type: "src",
                filter: (tag, attribute, attributes, resourcePath) => {
                  return tag.toLowerCase() !== "script";
                },
              },
            ],
          },
        }
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(), // 进程
    new CleanWebpackPlugin(), // 清理dist
    new HtmlWebpackPlugin({
      filename: "index.html",
      title: "template",
      template: "src/index.html",
    }),
    new CopyPlugin({
      patterns: [
        { from: "src/public", to: "public" },
        { from: "src/favicon.ico", to: "favicon.ico" },
      ],
    }),
    new MiniCssExtractPlugin({
      linkType: "text/css",
      filename: "css/[name].min.css",
      chunkFilename: "css/[id].css",
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
