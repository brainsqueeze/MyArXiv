const webpack = require('webpack');
// let ExtractTextPlugin = require("extract-text-webpack-plugin");
// let extractCSS = new ExtractTextPlugin("styles.css");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
let path = require('path');

config = {
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          name: "common",
          test: /[\\/]node_modules[\\/]/,
          // test: (module, chunk) => module.type === 'javascript/auto' && module.context.indexOf('node_modules') >= 0,
          priority: -10,
          filename: "[name].bundle.js",
          chunks: "all",
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  // performance: {
  //   hints: 'warning'
  // },
  resolve: {
    symlinks: false
  },
  devtool: false,
  //TODO: Re-enable when debugging js needed. Commented to speed up hotloader refresh speed
  // devtool: 'source-map',
  entry: [
    //start application
    './src/index.js'
  ],
  output: {
    pathinfo: false,
    path: __dirname,
    publicPath: '/',
    filename: 'bundle.js'
    
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
        use: [
          // {
          //   loader: 'cache-loader',
          //   // options: {
          //   //   cacheKey,
          //   //   read,
          //   //   write,
          //   // }
          // },
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-transform-runtime']
            }
          }
        ]
        // loader: 'babel-loader',
        // options: {
        //   cacheDirectory: true,
        //   cacheCompression: false,
        //   presets: ['@babel/preset-env'],
        //   plugins: ['@babel/plugin-transform-runtime']
        // }
      }
      // {
      //   test: /\.css$/,
      //   loader: extractCSS.extract("css-loader?sourceMap")
      // }
      
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // sassLoader: {
  //   includePaths: [path.resolve(__dirname, "./style")]
  // },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    // new webpack.SourceMapDevToolPlugin({
    //   filename: 'bundle.js.map',
    //   exclude: ['common.bundle.js']
    // })
    
    // extractCSS
    //activates HMR
    // new webpack.HotModuleReplacementPlugin(),

    //prints more readable module names in the browser console on HMR updates
    // new webpack.NamedModulesPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    disableHostCheck: true,
    contentBase: './',
    port: 9090,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000
    },
    stats: {
      all: false,
      // Show the url we're serving at
      wds: true,
      // Config for minimal console.log mess.
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: true,
      chunkGroups: true,
      chunkModules: false,
        // Add errors
      errors: true,

      // Add details to errors (like resolving log)
      errorDetails: true,
      env: true,
      // Add timing information
      timings: true

    }
  }
};

if(!process.env.NODE_ENV || process.env.NODE_ENV.startsWith('local')) {
  
  if(process.env.NODE_ENV === 'localdev') {

    config.devtool = 'source-map';
    // config.plugins.push(
    //   new webpack.SourceMapDevToolPlugin({
    //     filename: 'bundle.js.map',
    //     exclude: ['common.bundle.js']
    //   })
    // )
  }

  config.entry.push(
    //activate HMR for React
    'react-hot-loader/patch',

    //bundle the client for hot reloading
    //only- means to only hot reload for successful updates
    'webpack/hot/dev-server',

    //bundle the client for webpack dev server
    //and connect to the provided endpoint
    'webpack-dev-server/client?http://localhost:9090'
  );

  // config.module.loaders.push({
  //   test: /\.scss$|\.css$/,
  //   loader: extractCSS.extract(["css-loader?sourceMap", "sass-loader?sourceMap"])
  // }); 

  config.module.rules.push({
    test: /\.scss$|\.css$/,
    loaders: ['style-loader', 'css-loader', 'sass-loader']
  });

  //TODO: Re-enable to allow embedding external url-based resources in css
  // config.module.loaders.push({
  //   test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
  //   loader: 'url-loader',
  //   options: {
  //     limit: 500000
  //   }
  // });

  //TODO: Disable when url loader above is enabled
  config.module.rules.push({
    test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: 'file-loader?name=fonts/[name].[ext]'
  });

}
else {
  config.devtool = 'source-map';

  config.module.rules.push({
    test: /\.scss$|\.css$/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
  }); 
    // loader: extractCSS.extract(["css-loader?sourceMap", "sass-loader?sourceMap"])

  config.module.rules.push({
    test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
    loader: 'url-loader',
    options: {
      limit: 8192
    }
  });

  config.plugins.push(
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: '[name].styles.css'
    })
  );

  // config.module.loaders.push({
  //   test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
  //   loader: 'file-loader?name=fonts/[name].[ext]'
  // });

}

module.exports = config;
