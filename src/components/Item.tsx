/**
 * External dependencies
 */
// import { NavigationItem as NavigationItemFill } from './NavigationItem';

import {
	// @ts-ignore
	__experimentalNavigationItem as NavigationItem,
	// @ts-ignore
	// __experimentalUseSlot as useSlot,
} from '@wordpress/components';

import { MenuItem } from './types';

import './Item.css';

const Item = ( { item }: { item: MenuItem } ) => {
	// const slot = useSlot( 'rm_navigation_' + item.id );
	// const hasFills = Boolean( slot.fills && slot.fills.length );

	// Disable reason: The div wrapping the slot item is used for tracking purposes
	// and should not be a tabbable element.
	/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

	// Only render a slot if a coresponding Fill exists and the item is not a category
	// if ( hasFills && ! item.isCategory ) {
	// 	return (
	// 		<NavigationItemFill key={ item.id } item={ item.id }>
	// 			<div>
	// 				<NavigationItemFill.Slot name={ item.id } />
	// 			</div>
	// 		</NavigationItemFill>
	// 	);
	// }

	return (
		<NavigationItem
			key={ item.id }
			className="rm-nav-item"
			item={ item.id }
			title={ item.title }
			href={ item.url }
			navigateToMenu={ ! item.url && item.id }
			hideIfTargetMenuEmpty
		/>
	);
	/* eslint-enable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */
};

export default Item;
