<?php

namespace rmccue\ExperiementalNavigation;

use Asset_Loader;

const SCRIPT_ID = 'rmccue-experimental-nav';

function bootstrap() {
	add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\\enqueue_assets' );
	add_action( 'adminmenu', function () {
		// Close the existing menu's markup.
		echo '</ul></div></div>';

		// Insert our root alongside it.
		echo '<div id="rmccue-experimental-nav" class="hide-if-no-js"></div>';

		// And re-add dummy markup.
		echo '<div class="hide-if-js"><div><ul>';
	}, 1000 );
}

/**
 * Enqueue the JS and CSS for blocks in the editor.
 *
 * @return void
 */
function enqueue_assets() {
	if ( $GLOBALS['pagenow'] !== 'tools.php' ) {
		// return;
	}

	wp_add_inline_script( 'jquery-migrate', 'jQuery.migrateMute = true;', 'before' );

	Asset_Loader\enqueue_asset(
		// In a plugin, this would be `plugin_dir_path( __FILE__ )` or similar.
		plugin_dir_path( __DIR__ ) . '/build/asset-manifest.json',
		// The handle of a resource within the manifest. For static file fallbacks,
		// this should also match the filename on disk of a build production asset.
		'app.js',
		[
			'handle' => SCRIPT_ID,
			'dependencies' => [
				'lodash',
				'wp-components',
				'wp-data',
				'wp-element',
				'wp-html-entities',
			],
			'in-footer' => true,
		]
	);

	wp_localize_script( SCRIPT_ID, 'rmExperimentalNav', [
		'site' => [
			'name' => get_bloginfo( 'name' ),
			'url' => home_url(),
			'icon' => has_custom_logo() ? wp_get_attachment_url( get_theme_mod( 'custom_logo' ) ) : null,
		],
		'menu' => get_menu_data(),
		'current' => get_current_page(),
	] );

	Asset_Loader\enqueue_asset(
		// In a plugin, this would be `plugin_dir_path( __FILE__ )` or similar.
		plugin_dir_path( __DIR__ ) . '/build/asset-manifest.json',
		// Enqueue CSS for the editor.
		'app.css',
		[
			'handle'       => SCRIPT_ID,
			'dependencies' => [
				'wp-components',
			],
		]
	);
}

function get_current_page() {
	global $parent_file, $submenu_file;
	if ( isset( $submenu_file ) ) {
		return $submenu_file;
	}

	return $parent_file;
}

function get_menu_data() {
	global $menu, $submenu;

	$data = [];

	foreach ( $menu as $priority => $item ) {
		// Skip separators.
		if ( $item[4] === 'wp-menu-separator' ) {
			continue;
		}

		list( $title, $cap, $slug ) = $item;
		if ( ! current_user_can( $cap ) ) {
			continue;
		}

		// Decode slug.
		$has_children = ! empty( $submenu[ $slug ] );

		if ( $slug === 'edit-comments.php' ) {
			$title = __( 'Comments' );
		}

		// $menu_hook     = get_plugin_page_hook( $submenu_items[0][2], $item[2] )
		// 	if ( ! empty( $menu_hook )
		// 		|| ( ( 'index.php' !== $submenu_items[0][2] )
		// 			&& file_exists( WP_PLUGIN_DIR . "/$menu_file" )
		// 			&& ! file_exists( ABSPATH . "/wp-admin/$menu_file" ) )
		// 	) {
		$menu_hook = get_plugin_page_hook( $item[2], 'admin.php' );
		$url = $menu_hook ? 'admin.php?page=' . $slug : wp_specialchars_decode( $slug );

		$menu_id = 'primary';
		if ( $slug === 'options-general.php' || $slug === 'tools.php' ) {
			$menu_id = 'secondary';
		}

		$new_item = [
			'title' => wp_specialchars_decode( $title ),
			'capability' => $cap,
			'id' => $slug,
			'menuId' => $menu_id,
			'order' => $priority,
			'parent' => 'root',
			'isCategory' => $has_children,
		];
		if ( $has_children ) {
			$new_item['isCategory'] = true;
		} else {
			$new_item['url'] = admin_url( $url );
		}
		$data[] = $new_item;

		if ( $has_children ) {
			foreach ( $submenu[ $slug ] as $priority => $subitem ) {
				if ( ! current_user_can( $subitem[1] ) ) {
					continue;
				}

				$menu_hook = get_plugin_page_hook( $subitem[2], $slug );
				$url = $menu_hook ? 'admin.php?page=' . $subitem[2] : wp_specialchars_decode( $subitem[2] );
				$data[] = [
					'title' => $subitem[0],
					'capability' => $subitem[1],
					'id' => $subitem[2],
					'menuId' => $menu_id,
					'order' => $priority,
					'parent' => $slug,
					'url' => admin_url( $url ),
				];
			}
		}
	}

	// Add site switcher.
	$data[] = [
		'title' => 'Switch Site',
		'capability' => 'read',
		'id' => 'switch-sites',
		'menuId' => 'secondary',
		'order' => 10000,
		'parent' => 'root',
		'isCategory' => true,
	];

	global $wp_admin_bar;
	foreach ( (array) $wp_admin_bar->user->blogs as $blog ) {
		switch_to_blog( $blog->userblog_id );

		$blogname = $blog->blogname;
		if ( ! $blogname ) {
			$blogname = preg_replace( '#^(https?://)?(www.)?#', '', get_home_url() );
		}

		$data[] = [
			'title' => $blogname,
			'capability' => 'read',
			'id' => sprintf( 'blog-%d', $blog->userblog_id ),
			'menuId' => 'secondary',
			'order' => 0,
			'parent' => 'switch-sites',
			'url' => admin_url(),
		];

		restore_current_blog();
	}

	return $data;
}
