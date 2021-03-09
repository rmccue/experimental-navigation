import { render } from '@wordpress/element';

import App from './components/App';
import './types.d.ts';

const root = document.getElementById( 'rmccue-experimental-nav' );

render( <App />, root );

if ( process.env.NODE_ENV === 'development' ) {
	// @ts-ignore
	module.hot.accept( './components/App', () => {
		import( './components/App' ).then( NewApp => {
			render( <NewApp.default />, root );
		} );
	} );
}
