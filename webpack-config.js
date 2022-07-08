const path = require("path");

module.exports = {
  // development or production。
  mode: "development",
  // エントリーポイントの設定
  entry: "./src/ts/index.ts",
  // 出力の設定
  output: {
    // 出力するファイル名
    filename: "main.js",
    // 出力先のパス
    path: path.join(__dirname, "./"),
  },
  module: {
    rules: [
      {
        // 拡張子 .ts の場合
        test: /\.ts$/,
        // TypeScript をコンパイルする
        use: "ts-loader",
      },
    ],
  },
  resolve: {
    // fallback: { crypto: false },
    // 拡張子を配列で指定
    extensions: [".ts", ".js"],
    alias: {
      src: path.resolve(__dirname, "/src"),
    },
    modules: [path.resolve("./src/"), path.resolve("./node_modules")],
  },
};
