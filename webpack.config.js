let nodeExternals = require('webpack-node-externals');
let webpack = require('webpack');
let _ = require('lodash');
let harp  = require('harp');
let fs = require('fs');

// Easy Copy Function
const copy = (src, dst) => fs.createReadStream(src).pipe(fs.createWriteStream(dst));

// Default env
process.env.NODE_ENV == process.env.NODE_ENV || 'development';

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

// Main Webpack Config Object
let config = {
  entry: './src/app.js',
  target: 'node',
  node: {
    __dirname: true
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV'])
  ],
  externals: [nodeExternals()],
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
      }
    ]
  }
};

// Customizer function to aid merging
function customizer(objValue, srcValue) {
  if (_.isArray(objValue)) {
    return objValue.concat(srcValue);
  }
}

// Merge configs if production
if (process.env.NODE_ENV == 'production') {
  config = _.mergeWith(config, {
    output: {
      path: __dirname + '/dist'
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({ compress: true }),
      new BuildPlugin
    ]
  }, customizer);
}

module.exports = config;
