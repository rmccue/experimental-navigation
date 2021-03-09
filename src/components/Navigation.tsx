/**
 * External dependencies
 */
import { useEffect, useMemo, useState, useRef } from '@wordpress/element';
import classnames from 'classnames';
// import { NAVIGATION_STORE_NAME, useUser } from '@woocommerce/data';

import {
	// @ts-ignore
	__experimentalNavigation as NavigationComponent,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { MenuItem, Site } from './types';
import {
	getMappedItemsCategories,
	getMatchingItem,
} from './utils';
import Header from './Header';
import { PrimaryMenu } from './PrimaryMenu';
import { SecondaryMenu } from './SecondaryMenu';

import './Navigation.css';

interface Props {
	current: string,
	menuItems: MenuItem[],
	site: Site,
}

const Navigation = ( props: Props ) => {
	const { current, menuItems, site } = props;

	useEffect( () => {
		// Collapse the original WP Menu.
		document.documentElement.classList.remove( 'wp-toolbar' );
		document.body.classList.add( 'rm-new-nav-enabled' );
		const adminMenu = document.getElementById( 'adminmenumain' );

		if ( ! adminMenu ) {
			return;
		}

		adminMenu.classList.add( 'folded' );
	}, [] );

	const [ activeItem, setActiveItem ] = useState( 'root' );
	const [ activeLevel, setActiveLevel ] = useState( 'root' );

	// Find the initial item, where possible.
	useEffect( () => {
		const initialMatchedItem = getMatchingItem( menuItems, current );
		if ( initialMatchedItem && activeItem !== initialMatchedItem.id ) {
			setActiveItem( initialMatchedItem.id );
			setActiveLevel( initialMatchedItem.parent );
		}
	}, [ current, menuItems ] );

	const { categories, items } = useMemo(
		() => getMappedItemsCategories( menuItems ),
		[ menuItems ]
	);

	const navDomRef = useRef<HTMLDivElement>( null );
	const classes = classnames( 'rm-navigation', {
		'is-root': activeLevel === 'root',
	} );

	return (
		<div className={ classes }>
			<Header
				site={ site }
			/>
			<div className="rm-navigation__wrapper" ref={ navDomRef }>
				<NavigationComponent
					activeItem={ activeItem || null }
					activeMenu={ activeLevel }
					className="rm-navigation__navigator"
					onActivateMenu={ ( ...args: Parameters<typeof setActiveLevel> ) => {
						if ( navDomRef && navDomRef.current ) {
							navDomRef.current.scrollTop = 0;
						}

						setActiveLevel( ...args );
					} }
				>
					{ Object.keys( categories ).map( key => {
						const category = categories[ key ];
						const categoryItems = items[ category.id ];

						return (
							!! categoryItems && [
								<PrimaryMenu
									key={ category.id }
									category={ category }
									primaryItems={ [
										...categoryItems.primary,
										...categoryItems.favorites,
									] }
									pluginItems={ categoryItems.plugins }
								/>,
								<SecondaryMenu
									key={ `secondary/${ category.id }` }
									category={ category }
									items={ categoryItems.secondary }
								/>,
							]
						);
					} ) }
				</NavigationComponent>
			</div>
		</div>
	);
};

export default Navigation;
