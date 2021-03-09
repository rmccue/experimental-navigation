export interface MenuItem {
	capability?: string,
	id: string,
	isCategory?: boolean,
	matchExpression?: string,
	menuId: string,
	migrate: boolean,
	order: number,
	parent: string,
	title: string,
	url?: string,
}

export interface Category extends MenuItem {
	backButtonLabel?: string,
}

export interface Site {
	name: string,
	url: string,
	icon: string | null,
}
