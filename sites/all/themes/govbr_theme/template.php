<?php

/**
 * @file
 * template.php
 */


/**
 * Implements hook_theme().
 *
 * Register theme hook implementations.
 *
 * @see _bootstrap_theme()
 */
function govbr_theme_theme(&$existing, $type, $theme, $path) {
  return _bootstrap_theme($existing, $type, $theme, $path);
}

/**
 * Declare various hook_*_alter() hooks.
 *
 * hook_*_alter() implementations must live (via include) inside this file so
 * they are properly detected when drupal_alter() is invoked.
 */
bootstrap_include('bootstrap', 'theme/alter.inc');

/**
 * Include helpers functions.
 */
bootstrap_include('govbr_theme', 'theme/helpers.inc');

/** 
* remove a tag generator from the head for Drupal 7
* replace the meta content-type tag for Drupal 7
*/
function govbr_theme_html_head_alter(&$head_elements) {
  unset($head_elements['system_meta_generator']);
  $head_elements['system_meta_content_type']['#attributes'] = array('charset' => 'utf-8');
}
