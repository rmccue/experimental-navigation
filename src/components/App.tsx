import Navigation from './Navigation';

import './App.css';

export default function App() {
	const data = window.rmExperimentalNav;
	return (
		<>
			<Navigation
				current={ data.current }
				menuItems={ data.menu }
				site={ data.site }
			/>
		</>
		// <NavContainer />
	);
}
