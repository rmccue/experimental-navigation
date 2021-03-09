import { MenuItem, Site } from './components/types';

declare global {
	interface Window {
		rmExperimentalNav: {
			current: string,
			menu: MenuItem[],
			site: Site,
		}
	}
}
