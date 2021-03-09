/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { useEffect, useState } from '@wordpress/element';
import classnames from 'classnames';
import { debounce } from 'lodash';

/**
 * Internal dependencies
 */
import { useIsScrolled } from './hooks';
import { Site } from './types';

import './Header.css';

interface Props {
	site: Site,
}

const Header = ( props: Props ) => {
	const isScrolled = useIsScrolled();
	const [ isFolded, setIsFolded ] = useState(
		document.body.classList.contains( 'is-rm-navigation-folded' )
		|| ( document.body.classList.contains( 'block-editor-page' ) && document.body.classList.contains( 'is-fullscreen-mode' ) )
	);
	const navClasses = {
		folded: 'is-rm-navigation-folded',
		expanded: 'is-rm-navigation-expanded',
	};

	const foldNav = () => {
		document.body.classList.add( navClasses.folded );
		document.body.classList.remove( navClasses.expanded );
		setIsFolded( true );
	};

	const expandNav = () => {
		document.body.classList.remove( navClasses.folded );
		document.body.classList.add( navClasses.expanded );
		setIsFolded( false );
	};

	const toggleFolded = () => {
		if ( document.body.classList.contains( navClasses.folded ) ) {
			expandNav();
		} else {
			foldNav();
		}
	};

	const foldOnMobile = ( screenWidth = document.body.clientWidth ) => {
		if ( screenWidth <= 960 ) {
			foldNav();
		} else {
			expandNav();
		}
	};

	useEffect( () => {
		foldOnMobile();
		const foldEvents = [
			{
				eventName: 'orientationchange',
				handler: ( e: any ) => foldOnMobile( e.target?.screen.availWidth ),
			},
			{
				eventName: 'resize',
				handler: debounce( () => foldOnMobile(), 200 ),
			},
		];

		for ( const { eventName, handler } of foldEvents ) {
			window.addEventListener( eventName, handler, false );
		}
	}, [] );

	// Synchronize Gutenberg's full-screen state.
	const { isFullscreenActive } = useSelect( ( select ) => {
		return {
			isFullscreenActive: select( 'core/edit-post' )?.isFeatureActive( 'fullscreenMode' ),
		};
	} );
	const [ wasFullscreenActive, setWasFullscreenActive ] = useState( false );
	useEffect( () => {
		if ( wasFullscreenActive && ! isFullscreenActive ) {
			expandNav();
			setWasFullscreenActive( isFullscreenActive );
		} else if ( ! wasFullscreenActive && isFullscreenActive ) {
			foldNav();
			setWasFullscreenActive( isFullscreenActive );
		}
	}, [ isFullscreenActive, wasFullscreenActive ] );

	let buttonIcon: JSX.Element | null = <Icon size={ 36 } icon="wordpress-alt" />;
	if ( props.site.icon ) {
		buttonIcon = <img alt={ __( 'Site Icon' ) } src={ props.site.icon } />;
	}

	const className = classnames( 'rm-navigation-header', {
		'is-scrolled': isScrolled,
	} );

	return (
		<div className={ className }>
			<Button
				onClick={ () => toggleFolded() }
				className="rm-navigation-header__site-icon"
				aria-label="Fold navigation"
				role="switch"
				aria-checked={ isFolded ? 'true' : 'false' }
			>
				{ buttonIcon }
			</Button>
			<Button
				href={ props.site.url }
				className="rm-navigation-header__site-title"
				as="span"
			>
				{ decodeEntities( props.site.name ) }
			</Button>
		</div>
	);
};

export default Header;
