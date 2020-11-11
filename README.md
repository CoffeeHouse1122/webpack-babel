## 1. es6 -> es5
````
  npm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env --save
  npm install babel-plugin-transform-runtime --save-dev
  npm install babel-runtime --save
````
- @babel/polyfill (全部打包，污染全局变量)

```
  npm install --save @babel/polyfill
```

```js
  entry: ["@babel/polyfill", "./app/js"],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-transform-runtime"],
          },
        },
      },
    ]
  }
```

- core-js@3 (选择使用部分打包，污染全局变量)

````
  npm install core-js@3 --save

  # or

  npm install core-js@2 --save
````

````js
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
    ]
  }
````

- @babel/runtime-corejs3 (推荐)

````
  npm install --save @babel/runtime-corejs3 
````
````js
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [["@babel/plugin-transform-runtime", {
              corejs: 3
            }]],
          },
        },
      },
    ]
  }
````
