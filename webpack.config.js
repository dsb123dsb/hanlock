module.exports = function(env = {}) {
	const webpack     = require('webpack'),
		  path        = require('path'),
		  fs          = require('fs'),
		  packageConf = JSON.parse(fs.readFileSync('package.json'), 'utf-8');
	let name      = packageConf.name,
		version   = packageConf.version,
		library   = packageConf.name.replace(/(?:^|-)(\w)/g, (_, m) => m.toUpperCase()),
		proxyPort = 8081,
		plugins   = [],
		loaders   = [];   
	if (env.production) {
		name += `-${version}.min`;
		// compress js in production environment
		plugins.push (
			new webpack.optimize.UglifyJsPlugin({
				compress: {
					warnings: false,
					drop_console: false,
				}
			})
		);
	}
	if (fs.existsSync('./.babelrc')) {
		// use bable
		let babelConf = JSON.parse(fs.readFileSync('.babelrc'));
		loaders.push ({
			// test: /\.js$/,
			// exclude: /(node_modules|bower_components)/,
			loader: 'babel-loader',
			options: babelConf
			// query: babelConf
		});
	}
	return {
		entry: './lib/app.js',
		output: {
			filename: `${name}.js`,
			path: path.resolve(__dirname, 'dist'),
			publicPath: '/static/js',
			// 对外暴露的构造函数接口，既库的名字
			library: `${library}`,
			libraryTarget: 'umd'
		},

		plugins: plugins,

		module: {
			rules : [{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: loaders
			}]
			
		},
		devServer: {
			// 默认目录来打开文件
			contentBase: __dirname + "/src",  // New
			// proxy: {
			// 	"*": `http://127.0.0.1:${proxyPort}`,
			// }		
		}
	};
}
// module.exports = function(env = {}){

//   const webpack     = require('webpack'),
//         path        = require('path'),
//         fs          = require('fs'),
//         packageConf = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

//   let name      = packageConf.name,
//       version   = packageConf.version,
//       library   = name.replace(/^(\w)/, m => m.toUpperCase()),
//       proxyPort = 8083,
//       plugins   = [],
//       loaders   = [];

//   if(env.production){
//     name += `-${version}.min`;
//     //compress js in production environment
//     plugins.push(
//       new webpack.optimize.UglifyJsPlugin({
//         compress: {
//           warnings: false,
//           drop_console: false,
//          }
//       })
//     );
//   }

//   if(fs.existsSync('./.babelrc')){
//     //use babel
//     let babelConf = JSON.parse(fs.readFileSync('.babelrc'));
//     loaders.push({
//       test: /\.js$/,
//       exclude: /(node_modules|bower_components)/,
//       loader: 'babel-loader',
//       query: babelConf
//     });
//   }

//   return {
//     entry: './lib/app.js',
//     output: {
//       filename: `${name}.js`,
//       path: path.resolve(__dirname, 'dist'),
//       publicPath: '/static/js/',
//       library: `${library}`,
//       libraryTarget: 'umd'
//     },

//     plugins: plugins,

//     module: {
//       loaders: loaders
//     },

//     devServer: {
//       proxy: {
//         "*": `http://127.0.0.1:${proxyPort}`,
//       }
//     }
//   };
// }