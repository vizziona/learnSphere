const paths = require("./paths");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: [paths.src + "/index.js"],
  output: {
    path: paths.build,
    filename: "[name].bundle.js",
    publicPath: "/",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.static,
          to: "assets",
          globOptions: {
            ignore: ["*.DS_Store"],
          },
        },
      ],
    }),
    new HtmlWebpackPlugin({
      title: "React-fiber integration demo",
      favicon: paths.static + "/favicon.jpg",
      template: paths.src + "/template.html",
      filename: "index.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/, // Handle ESM in node_modules
        include: /node_modules/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: { sourceMap: true, importLoaders: 1 },
          },
          { loader: "postcss-loader", options: { sourceMap: true } },
          { loader: "sass-loader", options: { sourceMap: true } },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i,
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          context: "src",
        },
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|)$/,
        loader: "url-loader",
        options: {
          limit: 8192,
          name: "[path][name].[ext]",
          context: "src",
        },
      },
      {
        test: /\.(glb|gltf|hdr)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "assets/models/",
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    fullySpecified: false,
    alias: {
      "react/jsx-runtime": require.resolve("react/jsx-runtime"),
    },
  },
  stats: {
    errorDetails: true,
  },
  // Temporary log to debug resolve settings
  // Remove after confirming the config is applied
  // console.log('Resolve Config:', JSON.stringify(module.exports.resolve, null, 2)),
};
