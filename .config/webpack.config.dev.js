/**
 * .config/webpack.config.prod.js :
 * This file defines the production build configuration
 */
const { helpers, externals, loaders, presets } = require( '@humanmade/webpack-helpers' );
const postcssNesting = require( 'postcss-nesting' );
const { choosePort, filePath } = helpers;

// Mutate the loader defaults.
loaders.ts.defaults.loader = 'babel-loader';
loaders.postcss.defaults.options.postcssOptions.plugins.push( postcssNesting() );

module.exports = choosePort( 8080 ).then( port => [
	presets.development( {
		devServer: {
			port,
		},
		externals,
		entry: {
			app: filePath( 'src/index.tsx' ),
		},
		output: {
			path: filePath( 'build' ),
			publicPath: `http://localhost:${ port }/`,
		},
		resolve: {
			extensions: [
				'.ts',
				'.tsx',
				'.wasm',
				'.mjs',
				'.js',
				'.json',
			],
		},
	} ),
] );
