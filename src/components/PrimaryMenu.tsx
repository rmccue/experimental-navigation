/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

import {
	// @ts-ignore
	__experimentalNavigationMenu as NavigationMenu,
	// @ts-ignore
	__experimentalNavigationGroup as NavigationGroup,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import CategoryTitle from './CategoryTitle';
import Item from './Item';
import { Category, MenuItem } from './types';

interface Props {
	category: Category,
	onBackClick?( id: string ): void,
	pluginItems: MenuItem[],
	primaryItems: MenuItem[],
}

export const PrimaryMenu = ( {
	category,
	onBackClick,
	pluginItems,
	primaryItems,
}: Props ) => {
	if ( ! primaryItems.length && ! pluginItems.length ) {
		return null;
	}

	return (
		<NavigationMenu
			title={ <CategoryTitle category={ category } /> }
			menu={ category.id }
			parentMenu={ category.parent }
			backButtonLabel={ category.backButtonLabel || null }
			onBackButtonClick={ ( onBackClick && category.id !== 'root' ) ? () => onBackClick( category.id ) : null }
		>
			{ !! primaryItems.length && (
				<NavigationGroup>
					{ primaryItems.map( ( item ) => (
						<Item key={ item.id } item={ item } />
					) ) }
				</NavigationGroup>
			) }
			{ !! pluginItems.length && (
				<NavigationGroup
					title={
						category.id === 'root'
							? __( 'Extensions', 'woocommerce-admin' )
							: null
					}
				>
					{ pluginItems.map( ( item ) => (
						<Item key={ item.id } item={ item } />
					) ) }
				</NavigationGroup>
			) }
		</NavigationMenu>
	);
};
