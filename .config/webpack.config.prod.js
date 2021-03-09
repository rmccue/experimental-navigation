/**
 * .config/webpack.config.prod.js :
 * This file defines the production build configuration
 */
const { helpers, externals, loaders, presets } = require( '@humanmade/webpack-helpers' );
const postcssNesting = require( 'postcss-nesting' );
const { filePath } = helpers;

// Mutate the loader defaults.
loaders.ts.defaults.loader = 'babel-loader';
loaders.postcss.defaults.options.postcssOptions.plugins.push( postcssNesting() );

module.exports = presets.production( {
	externals,
	entry: {
		app: filePath( 'src/index.tsx' ),
	},
	output: {
		path: filePath( 'build' ),
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
} );
