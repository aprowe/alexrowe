let nodeExternals = require('webpack-node-externals');
let webpack = require('webpack');
let _ = require('lodash');
let harp  = require('harp');
let fs = require('fs');
let path = require('path');

// Default env
const PROD = process.env.NODE_ENV == 'production';

// Config that server and client share
let commonConfig = {
  // Provide the Node environment
  plugins: _.compact([
    new webpack.EnvironmentPlugin(['NODE_ENV']),
    PROD && new webpack.optimize.UglifyJsPlugin({ compress: true }),
  ]),
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel-loader',
    }, {
      test: /\.html$/,
      loader: 'mustache-loader',
    }, {
      test: /\.md$/,
      loader: 'mustache-loader!markdown-loader',
    }, {
      test: /\.scss$/,
      loader: 'style-loader!css-loader!sass-loader',
    }]
  },
  resolve: {
    alias: {
      views: path.resolve(__dirname, 'src/client/views'),
      client: path.resolve(__dirname, 'src/client'),
    },
  },
  output: {
    path: __dirname + (PROD ? '/dist' : ''),
  }
};

// Main Webpack Config Object
let serverConfig = _.merge({}, commonConfig, {
  entry: './src/app.js',
  target: 'node',
  node: {
    __dirname: true
  },
  externals: [nodeExternals()],
  output: {
    filename: 'app.js'
  }
});

// Client config object
let clientConfig = _.merge({}, commonConfig, {
  entry: './src/client/scripts/index.js',
  output: {
    filename: 'assets/client.js'
  },
});

// Easy Copy Function
const copy = (src, dst) => fs.createReadStream(src).pipe(fs.createWriteStream(dst));

// Plugin to do custom tasks
class BuildPlugin {
  apply (compiler) {

    // Copy NPM Files
    compiler.plugin('done', () => {
      copy('package.json', compiler.outputPath + '/package.json');
      copy('package-lock.json', compiler.outputPath + '/package-lock.json');
    });

    // Compile HARP assets
    compiler.plugin('run', (compiler, cb) => {
      harp.compile(__dirname + '/static', compiler.outputPath + '/static' , cb);
    });
  }
}

// Merge configs if production
PROD && serverConfig.plugins.push(new BuildPlugin);

module.exports = [serverConfig, clientConfig];
