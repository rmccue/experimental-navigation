/**
 * External dependencies
 */
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
	items: MenuItem[],
	onBackClick?( id: string ): void,
}

export const SecondaryMenu = ( { category, items, onBackClick }: Props ) => {
	if ( ! items.length ) {
		return null;
	}

	const isRoot = category.id === 'root';

	return (
		<NavigationMenu
			className="components-navigation__menu-secondary"
			title={ ! isRoot && <CategoryTitle category={ category } /> }
			menu={ category.id }
			parentMenu={ category.parent }
			backButtonLabel={ category.backButtonLabel || null }
			onBackButtonClick={
				( ! onBackClick || isRoot ) ? null : () => onBackClick( category.id )
			}
		>
			<NavigationGroup
				onBackButtonClick={ onBackClick ? () => onBackClick( category.id ) : null }
			>
				{ items.map( ( item ) => (
					<Item key={ item.id } item={ item } />
				) ) }
			</NavigationGroup>
		</NavigationMenu>
	);
};
