<?php
/**
 * Plugin Name: Experimental Navigation for WordPress
 * Description: Try a new form of navigation in your WordPress dashboard.
 * Author: Ryan McCue
 * Author URI: https://rmccue.io/
 */

namespace rmccue\ExperiementalNavigation;

// Load Composer, if installed standalone.
if ( file_exists( __DIR__ . '/vendor/autoload.php' ) ) {
	require __DIR__ . '/vendor/autoload.php';
}

require __DIR__ . '/inc/namespace.php';

bootstrap();
