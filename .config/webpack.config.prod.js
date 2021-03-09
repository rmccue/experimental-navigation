/**
 * .config/webpack.config.prod.js :
 * This file defines the production build configuration
 */
const { helpers, externals, presets } = require( '@humanmade/webpack-helpers' );
const { filePath } = helpers;

loaders.ts.defaults.loader = 'babel-loader!ts-loader';

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
			'ts',
			'tsx',
			'js',
			'json',
		],
	},
} );
