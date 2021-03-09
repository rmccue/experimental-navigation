import { Category } from './types';

import './CategoryTitle.css';

export const CategoryTitle = ( { category }: { category: Category } ) => {
	const { menuId, title } = category;

	const className = 'rm-navigation-category-title';

	if ( [ 'plugins', 'favorites' ].includes( menuId ) ) {
		return (
			<span className={ className }>
				<span className={ `${ className }__text` }>{ title }</span>
			</span>
		);
	}

	return <span className={ className }>{ title }</span>;
};

export default CategoryTitle;
