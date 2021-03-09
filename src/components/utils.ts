import { MenuItem } from './types';

/**
 * Get a match score for a menu item given a location.
 *
 * @param {Object} location Window location
 * @param {string} itemUrl	 URL to compare
 * @param {string} itemExpression Custom match expression
 * @return {number} Number of matches or 0 if not matched.
 */
export const getMatchScore = ( location: Location, itemUrl: string, itemExpression: string | null = null ): number => {
	if ( ! itemUrl ) {
		return 0;
	}

	const { href } = location;

	// Return highest possible score for exact match.
	if ( itemUrl === href ) {
		return Number.MAX_SAFE_INTEGER;
	}

	const defaultExpression = getDefaultMatchExpression( itemUrl );
	const regexp = new RegExp( itemExpression || defaultExpression, 'i' );
	return ( decodeURIComponent( href ).match( regexp ) || [] ).length;
};

/**
 * Get a default expression to match the path and provided params.
 *
 * @param {string} url URL to match.
 * @return {string} Regex expression.
 */
export const getDefaultMatchExpression = ( url: string ): string => {
	const escapedUrl = url.replace( /[-\/\\^$*+?.()|[\]{}]/gi, '\\$&' );
	const [ path, args, hash ] = escapedUrl.split( /\\\?|#/ );
	const hashExpression = hash ? `(.*#${ hash }$)` : '';
	const argsExpression = args
		? args.split( '&' ).reduce( ( acc, param ) => {
				return `${ acc }(?=.*[?|&]${ param }(&|$|#))`;
		  }, '' )
		: '';
	return '^' + path + argsExpression + hashExpression;
};

/**
 * Get the closest matching item.
 *
 * @param {Array} items An array of items to match against.
 */
export const getMatchingItem = ( items: MenuItem[], current: string ): MenuItem | null => {
	let matchedItem: MenuItem | null = null;
	let highestMatchScore = 0;

	items.forEach( ( item ) => {
		// Where we have the item explicitly specified, just use it.
		if ( item.id === current ) {
			highestMatchScore = Number.MAX_SAFE_INTEGER;
			matchedItem = item;
			return;
		}

		// Otherwise, calculate a score, and pick the highest one.
		const score = getMatchScore(
			window.location,
			item.url || '',
			item.matchExpression
		);
		if ( score > 0 && score >= highestMatchScore ) {
			highestMatchScore = score;
			matchedItem = item;
		}
	} );

	return matchedItem || null;
};

/**
 * Available menu IDs.
 */
export const menuIds = [ 'primary', 'favorites', 'plugins', 'secondary' ];

/**
 * Default categories for the menu.
 */
export const defaultCategories = {
	root: {
		id: 'root',
		isCategory: true,
		menuId: 'primary',
		migrate: true,
		order: 10,
		parent: '',
		title: 'Your Dashboard',
	},
};

/**
 * Sort an array of menu items by their order property.
 *
 * @param {Array} menuItems Array of menu items.
 * @return {Array} Sorted menu items.
 */
export const sortMenuItems = ( menuItems: MenuItem[] ): MenuItem[] => {
	return [ ...menuItems ].sort( ( a, b ) => {
		if ( a.order === b.order ) {
			return a.title.localeCompare( b.title );
		}

		return a.order - b.order;
	} );
};

interface MappedItemsCategories {
	items: {
		[ parent: string ]: {
			[ menuId: string ]: MenuItem[],
		}
	},
	categories: {
		[ key: string ]: MenuItem,
	},
}

/**
 * Get a flat tree structure of all Categories and thier children grouped by menuId
 *
 * @param {Array} menuItems Array of menu items.
 * @param {Function} currentUserCan Callback method passed the capability to determine if a menu item is visible.
 * @return {Object} Mapped menu items and categories.
 */
export const getMappedItemsCategories = ( menuItems: MenuItem[] ): MappedItemsCategories => {
	const categories: MappedItemsCategories['categories'] = { ...defaultCategories };

	const items = sortMenuItems( menuItems ).reduce( ( acc: MappedItemsCategories['items'], item ) => {
		// Set up the category if it doesn't yet exist.
		if ( ! acc[ item.parent ] ) {
			acc[ item.parent ] = {};
			menuIds.forEach( ( menuId ) => {
				acc[ item.parent ][ menuId ] = [];
			} );
		}

		// Incorrect menu ID.
		if ( ! acc[ item.parent ][ item.menuId ] ) {
			return acc;
		}

		// Add categories.
		if ( item.isCategory ) {
			categories[ item.id ] = item;
		}

		acc[ item.parent ][ item.menuId ].push( item );
		return acc;
	}, {} );

	return {
		items,
		categories,
	};
};
