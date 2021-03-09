import { Slot, Fill } from '@wordpress/components';

/**
 * Create a Fill for extensions to add client facing custom Navigation Items.
 *
 * @param {Object} param0
 * @param {Array} param0.children - Node children.
 * @param {string} param0.item - Navigation item slug.
 */
export const NavigationItem = ( { children, item }: { children: React.ReactChild, item: string } ) => {
	return <Fill name={ 'rm_navigation_' + item }>{ children }</Fill>;
};
NavigationItem.Slot = ( { name }: { name: string } ) => (
	<Slot name={ 'rm_navigation_' + name } />
);
