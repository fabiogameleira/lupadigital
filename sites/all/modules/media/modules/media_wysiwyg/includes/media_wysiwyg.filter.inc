<?php

/**
 * @file
 * Functions related to the WYSIWYG editor and the media input filter.
 */

define('MEDIA_WYSIWYG_TOKEN_REGEX', '/\[\[\{.*?"type":"media".*?\}\]\]/s');

/**
 * Filter callback for media markup filter.
 *
 * @TODO check for security probably pass text through filter_xss
 */
function media_wysiwyg_filter($text, $filter = NULL, $format = NULL, $langcode = NULL, $cache = NULL, $cache_id = NULL) {
  $replacements = array();
  $patterns = array();
  $rendered_text = $text;
  $count = 1;
  preg_match_all(MEDIA_WYSIWYG_TOKEN_REGEX, $text, $matches);
  if (!empty($matches[0])) {
    foreach ($matches[0] as $match) {
      $replacement = media_wysiwyg_token_to_markup($match, FALSE, $langcode);
      $rendered_text = str_replace($match, $replacement, $rendered_text, $count);
    }
  }
  return $rendered_text;
}

/**
 * Filter callback to configure media_filter_paragraph_fix filter.
 */
function _media_filter_paragraph_fix_settings($form, &$form_state, $filter, $format, $defaults) {
  $filter->settings += $defaults;
  $settings['replace'] = array(
    '#type' => 'checkbox',
    '#title' => t('Replace paragraph tags with DIV.media-p tags'),
    '#default_value' => $filter->settings['replace'],
    '#description' => t('Default behaviour is to strip out parent P tags of media elements rather than replacing these.'),
  );
  return $settings;
}

/**
 * Filter callback to remove paragraph tags surrounding embedded media.
 */
function media_wysiwyg_filter_paragraph_fix($text, $filter) {
  $html_dom = filter_dom_load($text);
  // Store Nodes to remove to avoid inferferring with the NodeList iteration.
  $dom_nodes_to_remove = array();
  foreach ($html_dom->getElementsByTagName('p') as $paragraph) {
    if (preg_match(MEDIA_WYSIWYG_TOKEN_REGEX, $paragraph->nodeValue)) {
      if (empty($filter->settings['replace'])) {
        $sibling = $paragraph->firstChild;
        do {
          $next = $sibling->nextSibling;
          $paragraph->parentNode->insertBefore($sibling, $paragraph);
        } while ($sibling = $next);
        $dom_nodes_to_remove[] = $paragraph;
      }
      else {
        // Clone the P node into a DIV node.
        $div = $html_dom->createElement('div');
        $sibling = $paragraph->firstChild;
        do {
          $next = $sibling->nextSibling;
          $div->appendChild($sibling);
        } while ($sibling = $next);

        $classes = array('media-p');
        if ($paragraph->hasAttributes()) {
          foreach ($paragraph->attributes as $attr) {
            $name = $attr->nodeName;
            $value = $attr->nodeValue;
            if (strtolower($name) == 'class') {
              $classes[] = $value;
            }
            else {
              // Supressing errors with ID attribute or duplicate properties.
              @$div->setAttribute($name, $value);
            }
          }
        }
        $div->setAttribute('class', implode(' ', $classes));

        $paragraph->parentNode->insertBefore($div, $paragraph);
        $dom_nodes_to_remove[] = $paragraph;
      }
    }
  }
  foreach ($dom_nodes_to_remove as $paragraph) {
    $paragraph->parentNode->removeChild($paragraph);
  }
  $text = filter_dom_serialize($html_dom);
  return $text;
}

/**
 * Parses the contents of a CSS declaration block.
 *
 * @param string $declarations
 *   One or more CSS declarations delimited by a semicolon. The same as a CSS
 *   declaration block (see http://www.w3.org/TR/CSS21/syndata.html#rule-sets),
 *   but without the opening and closing curly braces. Also the same as the
 *   value of an inline HTML style attribute.
 *
 * @return array
 *   A keyed array. The keys are CSS property names, and the values are CSS
 *   property values.
 */
function media_wysiwyg_parse_css_declarations($declarations) {
  $properties = array();
  foreach (array_map('trim', explode(";", $declarations)) as $declaration) {
    if ($declaration != '') {
      list($name, $value) = array_map('trim', explode(':', $declaration, 2));
      $properties[strtolower($name)] = $value;
    }
  }
  return $properties;
}

/**
 * Turn an array of css property => value pairs to a string.
 *
 * @param array $properties
 *   A keyed array with css property => value pairs.
 *
 * @see media_wysiwyg_parse_css_declarations()
 */
function media_wysiwyg_stringify_css_declarations(array $properties) {
  $declarations = array();
  foreach ($properties as $property => $value) {
    $declarations[] = $property . ':' . $value;
  }
  return implode(';', $declarations);
}

/**
 * Basic schema for media wysiwyg tokens.
 *
 * This function is knowingly named '*_schema_token' and not ending with
 * '_schema' to avoid potential namespace conflict with hook_schema.
 *
 * @param $lang
 *   The programming language this is targeted at. Either 'php' (default) or
 *   'js'.
 *
 * @return array
 *   Structured array with properties (array keys) the media token may consist
 *   of. Each property is an array with the following keys:
 *   - required: (All) Whether or not this property is required in the token.
 *   - default: (All) Default value for property.
 *   - options: (Optional): List of allowed values for property where the key is
 *     the allowed value.
 */
function media_wysiwyg_schema_token($lang = 'php') {
  $schema = array(
    'type' => array(
      'required' => TRUE,
      'default' => 'media',
    ),
    'fid' => array(
      'required' => TRUE,
      'default' => 0,
    ),
    'view_mode' => array(
      'required' => FALSE,
      'default' => variable_get('media_wysiwyg_wysiwyg_default_view_mode', 'full'),
    ),
    'alignment' => array(
      'required' => FALSE,
      'default' => NULL,
      'options' => array(
        '' => t("None"),
        'left' => t("Left"),
        'center' => t("Center"),
        'right' => t("Right"),
      ),
    ),
    'instance_fields' => array(
      'required' => FALSE,
      'default' => 'override',
      'options' => array(
        'global' => t("Global"),
        'override' => t("Override"),
      ),
    ),
    'attributes' => array(
      'required' => FALSE,
      'default' => $lang == 'js' ? new StdClass() : array(),
    ),
  );
  foreach (array('external_url', 'link_text') as $property) {
    $schema[$property] = array(
      'required' => FALSE,
      'default' => NULL,
    );
  }
  return $schema;
}

/**
 * Get a list of overridable fields per file type.
 *
 * @return {array}
 *   Assoc array with file type as key and an array of fields as values. The
 *   field array is keyed by field name.
 */
function media_wysiwyg_overridable_fields() {
  $allowed_types = variable_get('media_wysiwyg_wysiwyg_allowed_types', array('audio', 'image', 'video', 'document'));
  $allowed_field_types = variable_get('media_wysiwyg_wysiwyg_override_field_types', array('text', 'text_long'));
  if (empty($allowed_types)) {
    $entity_info = entity_get_info('file');
    $allowed_types = array_keys($entity_info['bundles']);
  }
  $overridables = array();
  foreach ($allowed_types as $type) {
    $overridables[$type] = array();
    $fields = field_info_instances('file', $type);
    foreach ($fields as $field_name => $field_instance) {
      $field_info = field_info_field($field_name);
      if (in_array($field_info['type'], $allowed_field_types) && !empty($field_instance['settings']['wysiwyg_override'])) {
        $overridables[$type][$field_name] = true;
      }
    }
  }
  return $overridables;
}

/**
 * Validate media instance settings according to token schema.
 *
 * @param $settings
 *   The media instance settings, aka tag_info.
 */
function media_wysiwyg_validate_instance_settings(&$settings) {
  $schema = media_wysiwyg_schema_token();
  foreach ($schema as $property => $prop_settings) {
    if ($prop_settings['required'] && (!isset($settings[$property]) || !$settings[$property])) {
      throw new Exception("Token schema error: Required property missing: '" . $property . "'");
    }
    if (!isset($settings[$property]) || empty($settings[$property])) {
      // We set default values for properties that are empty to force the
      // correct type on it, and set non-required properties that have
      // non-empty values as default.
      $settings[$property] = $prop_settings['default'];
    }
    else {
      if (isset($prop_settings['options']) && !isset($prop_settings['options'][$settings[$property]])) {
        // Invalid option. Instead of throwing an exception, set the default
        // value so the media instance at least is rendered. @todo: Add some
        // message/log about malformed token?
        $settings[$property] = $prop_settings['default'];
      }
    }
  }
  if ($settings['type'] !== 'media') {
    throw new Exception("Token schema error: Token not of type 'media'");
  }
}

/**
 * Convert a media token into HTML markup.
 *
 * @param string $token
 *   Media token with surrounding double brackets ('[[…]]').
 * @param bool $wysiwyg
 *   Set to TRUE if called from within the WYSIWYG text area editor.
 *
 * @return string
 *   The HTML markup representation of the token, or an empty string on failure.
 *
 * @see media_wysiwyg_get_file_without_label()
 * @see hook_media_wysiwyg_token_to_markup_alter()
 */
function media_wysiwyg_token_to_markup($token, $wysiwyg = FALSE, $langcode = NULL) {
  static $recursion_stop;
  $json = str_replace("[[", "", $token);
  $json = str_replace("]]", "", $json);

  // Drupal modules with email support often include site name in the subject line
  // wrapped in brackets. With a token, this is rendered as "[[site:name]]". Such a
  // format will cause a conflict with media_wysiwyg, which is looking for the same.
  if (module_exists('token_filter')) {
    $token_filter = _token_filter_filter_tokens('[' . $tag . ']', '', '', $langcode, NULL, NULL);
    if ($token_filter != '[' . $tag . ']') {
      return '[[' . $tag . ']]';
    }
  }

  try {
    if (!is_string($json)) {
      throw new Exception('Unable to find matching tag');
    }

    $tag_info = drupal_json_decode($json);
    media_wysiwyg_validate_instance_settings($tag_info);
    if ($tag_info['view_mode'] != 'default') {
      $file_entity_info = entity_get_info('file');
      if (!in_array($tag_info['view_mode'], array_keys($file_entity_info['view modes']))) {
        // Media 1.x defined some old view modes that have been superseded by
        // more semantically named ones in File Entity. The media_update_7203()
        // function updates field settings that reference the old view modes,
        // but it's impractical to update all text content, so adjust
        // accordingly here.
        static $view_mode_updates = array(
          'media_preview' => 'preview',
          'media_small' => 'teaser',
          'media_large' => 'full',
        );
        if (isset($view_mode_updates[$tag_info['view_mode']])) {
          $tag_info['view_mode'] = $view_mode_updates[$tag_info['view_mode']];
        }
        else {
          throw new Exception('Invalid view mode');
        }
      }
    }
    if (!($file = file_load($tag_info['fid']))) {
      throw new Exception('Could not load media object');
    }
    // Check if we've got a recursion. Happens because a file_load() may
    // triggers file_entity_is_page() which then again triggers a file load.
    if (isset($recursion_stop[$file->fid])) {
      return '';
    }
    $recursion_stop[$file->fid] = TRUE;

    $tag_info['file'] = $file;

    if ($tag_info['instance_fields'] == 'override') {
      // Grab the potentially overridden fields from the file.
      $settings = media_wysiwyg_filter_field_parser($tag_info);
      foreach ($settings as $key => $value) {
        $file->{$key} = $value;
      }
    }
    else {
      $settings = array();
    }

    if (isset($tag_info['external_url'])) {
      $settings['external_url'] = $tag_info['external_url'];
    }
    // Analyze and filter attributes from token.
    $settings['attributes'] = array();
    if (!empty($tag_info['attributes']) && is_array($tag_info['attributes'])) {
      // The class attributes is a string, but drupal requires it to be an
      // array, so we fix it here.
      if (!empty($tag_info['attributes']['class'])) {
        $tag_info['attributes']['class'] = explode(' ', $tag_info['attributes']['class']);
      }
      $attribute_whitelist = media_wysiwyg_allowed_attributes();
      $settings['attributes'] = array_intersect_key($tag_info['attributes'], array_flip($attribute_whitelist));

      // Many media formatters will want to apply width and height independently
      // of the style attribute or the corresponding HTML attributes, so pull
      // these two out into top-level settings. Different WYSIWYG editors have
      // different behavior with respect to whether they store user-specified
      // dimensions in the HTML attributes or the style attribute - check both.
      // Per http://www.w3.org/TR/html5/the-map-element.html#attr-dim-width, the
      // HTML attributes are merely hints: CSS takes precedence.
      if (isset($settings['attributes']['style'])) {
        $css_properties = media_wysiwyg_parse_css_declarations($settings['attributes']['style']);
        foreach (array('width', 'height') as $dimension) {
          if (isset($css_properties[$dimension]) && substr($css_properties[$dimension], -2) == 'px') {
            $settings[$dimension] = substr($css_properties[$dimension], 0, -2);
          }
          elseif (isset($settings['attributes'][$dimension])) {
            $settings[$dimension] = $settings['attributes'][$dimension];
          }
        }
      }
      foreach (array('title', 'alt') as $field_type) {
        if (isset($settings['attributes'][$field_type])) {
          $settings['attributes'][$field_type] = decode_entities($settings['attributes'][$field_type]);
        }
      }
    }
    // Update file metadata from the potentially overridden tag info.
    foreach (array('width', 'height') as $dimension) {
      if (isset($settings['attributes'][$dimension])) {
        $file->metadata[$dimension] = $settings['attributes'][$dimension];
      }
    }
  }
  catch (Exception $e) {
    watchdog('media', 'Unable to render media from %tag. Error: %error', array('%tag' => $token, '%error' => $e->getMessage()));
    return '';
  }

  // If the tag has link text stored with it, override the filename with it for
  // the rest of this function, so that if the file is themed as a link, the
  // desired text will be used (see, for example, theme_file_link()).
  // @todo: Try to find a less hacky way to do this.
  if (isset($tag_info['link_text']) && variable_get('media_wysiwyg_use_link_text_for_filename', 1)) {
    // The link text will have characters such as "&" encoded for HTML, but the
    // filename itself needs the raw value when it is used to build the link,
    // in order to avoid double encoding.
    $file->filename = decode_entities($tag_info['link_text']);
  }

  if ($wysiwyg) {
    media_wysiwyg_fid_type_map_add($file->fid, $file->type);
    $settings['wysiwyg'] = $wysiwyg;

    // Render file in WYSIWYG using appropriate view mode.
    $view_mode = db_query('SELECT view_mode FROM {media_view_mode_wysiwyg} WHERE type = :type', array(
      ':type' => $file->type,
    ))
      ->fetchField();
    if (empty($view_mode)) {
      $view_mode = $tag_info['view_mode'];
    }
    $element = media_wysiwyg_get_file_without_label($file, $view_mode, $settings, $langcode);
  }
  else {
    // Display the field elements.
    $element = array();
    // Render the file entity, for sites using the file_entity rendering method.
    if (variable_get('media_wysiwyg_default_render', 'file_entity') == 'file_entity') {
      $element['content'] = file_view($file, $tag_info['view_mode'], $langcode);
    }
    $element['content']['file'] = media_wysiwyg_get_file_without_label($file, $tag_info['view_mode'], $settings, $langcode);
    // Overwrite or set the file #alt attribute if it has been set in this
    // instance.
    if (!empty($element['content']['file']['#attributes']['alt'])) {
      $element['content']['file']['#alt'] = $element['content']['file']['#attributes']['alt'];
    }
    // Overwrite or set the file #title attribute if it has been set in this
    // instance.
    if (!empty($element['content']['file']['#attributes']['title'])) {
      $element['content']['file']['#title'] = $element['content']['file']['#attributes']['title'];
    }
    // For sites using the legacy field_attach rendering method, attach fields.
    if (variable_get('media_wysiwyg_default_render', 'file_entity') == 'field_attach') {
      field_attach_prepare_view('file', array($file->fid => $file), $tag_info['view_mode'], $langcode);
      entity_prepare_view('file', array($file->fid => $file), $langcode);
      $element['content'] += field_attach_view('file', $file, $tag_info['view_mode'], $langcode);
    }
    if (count(element_children($element['content'])) > 1) {
      // Add surrounding divs to group them together.
      // We don't want divs when there are no additional fields to allow files
      // to display inline with text, without breaking p tags.
      $element['content']['#type'] = 'container';
      $element['content']['#attributes']['class'] = array(
        'media',
        'media-element-container',
        'media-' . $element['content']['file']['#view_mode'],
      );
      if (variable_get('media_wysiwyg_remove_media_class', FALSE)) {
        $classes = $element['content']['#attributes']['class'];
        $element['content']['#attributes']['class'] = array_diff($classes, array('media'));
      }
    }

    if (!empty($tag_info['alignment']) && !empty($element['content'])) {
      $element['content']['#attributes']['class'][] = 'media-wysiwyg-align-' . $tag_info['alignment'];
    }
    // Conditionally add a pre-render if the media filter output is be cached.
    $filters = filter_get_filters();
    if (!isset($filters['media_filter']['cache']) || $filters['media_filter']['cache']) {
      $element['#pre_render'][] = 'media_wysiwyg_pre_render_cached_filter';
    }
  }
  drupal_alter('media_wysiwyg_token_to_markup', $element, $tag_info, $settings, $langcode);
  $output = drupal_render($element);
  unset($recursion_stop[$file->fid]);
  return $output;
}

/**
 * Parse field properties of $tag_info into structured, sanitized fields data.
 *
 * Fields present in the $tag_info array are the string equivalent of accessing
 * the field's value, e.g. 'field_file_image_alt_text[und][0][value]' and the
 * value is the actual field value. These parts are turned into sanitized fields
 * data arrays with the full hierarchy of language, deltas, data column and
 * finally value.
 *
 * Only configured or programmed fields present in the site's installation is
 * parsed and returned.
 *
 * @param array $tag_info
 *   Media token as PHP array equivalent.
 *
 * @return array
 *   An array of fields with sanitized field data structures.
 */
function media_wysiwyg_filter_field_parser(array $tag_info) {
  $fields = array();
  // Field value reference candidates (keys) that end in [format] are
  // associated with long-text fields that may have HTML Entities. Those
  // values will need to be URLDecoded as well as HTMLDecoded.
  $url_encoded_fields = array();
  foreach ($tag_info as $candidate => $field_value) {
    if (preg_match('/\[format\]$/', $candidate) > 0) {
      $url_encoded_fields[] = preg_replace('/\[format\]$/', '[value]', $candidate);
    }
  }

  foreach ($tag_info as $candidate => $field_value) {
    $parsed_field = explode('[', str_replace(']', '', $candidate));
    if (count($parsed_field) < 2) {
      continue;
    }
    // We are garuanteed to have a value in $parsed_field[0].
    $info = field_info_field($parsed_field[0]);
    if (!$info) {
      // Not an existing/configured field.
      continue;
    }

    // Certain types of fields, because of differences in markup, end up here
    // with incomplete arrays. Make a best effort to support as many types of
    // fields as possible. Single-value select lists show up here with only 2
    // array items.
    if (count($parsed_field) == 2) {
      if ($info && !empty($info['columns'])) {
        // Assume single-value.
        $parsed_field[] = 0;
        // Next tack on the column for this field.
        $parsed_field[] = key($info['columns']);
      }
    }
    // Multi-value select lists show up here with 3 array items.
    elseif (count($parsed_field) == 3 && (empty($parsed_field[2]) || is_numeric($parsed_field[2]))) {
      // They just need the value column.
      $parsed_field[3] = key($info['columns']);
    }

    // Each key of the field needs to be the child of the previous key.
    $ref = &$fields;
    foreach ($parsed_field as $key) {
      if (!isset($ref[$key])) {
        $ref[$key] = array();
      }
      $ref = &$ref[$key];
    }
    // The value should be set at the deepest level.
    if (in_array($candidate, $url_encoded_fields)) {
      // Fields that use rich-text markup will be urlencoded.
      $ref = urldecode(decode_entities($field_value));
    }
    else {
      // Only entities need to be decoded.
      $ref = decode_entities($field_value);
    }
  }
  // Strip fields for empty values. This is necessary to do post parsing of all
  // field entries as they may refer to the same field several times.
  foreach ($fields as $field_name => $field_languages) {
    $info = field_info_field($field_name);
    if (isset($field_languages) && is_array($field_languages)) {
      foreach ($field_languages as $lang => $items) {
        $fields[$field_name][$lang] = _field_filter_items($info, $items);
      }
    }
  }
  return $fields;
}

/**
 * Add and keep a map of file IDs => file types.
 *
 * @param int fid
 *   The file ID
 * @param string type
 *   The file type of given file ID.
 */
function media_wysiwyg_fid_type_map_add($fid = 0, $type = '', $reset = FALSE) {
  $fid_type_map = &drupal_static('media_wysiwyg_fid_type_map', array());
  if (!$fid) {
    return $fid_type_map;
  }
  $fid_type_map[$fid] = $type;
}

/**
 * Get map between file ID and their type.
 *
 * @param bool $reset
 *   Flush map after get.
 */
function media_wysiwyg_fid_type_map_get($reset = FALSE) {
  $map = media_wysiwyg_fid_type_map_add();
  if ($reset) {
    drupal_static_reset('media_wysiwyg_fid_type_map');
  }
  return $map;
}

/**
 * Creates map of inline media tags.
 *
 * Generates an array of [inline tags hash] => <html> to be used in filter
 * replacement and to add the mapping to JS.
 *
 * @param string $text
 *   The String containing text and html markup of textarea
 *
 * @return array
 *   An associative array with tag hash as key and html markup as the value.
 *
 * @see media_process_form()
 * @see media_token_to_markup()
 */
function _media_wysiwyg_generate_tagmap($text) {
  // Making $tagmap static as this function is called several times to avoid
  // getting duplicate markup for the same macro.
  $tagmap = &drupal_static(__FUNCTION__, array());
  preg_match_all("/\[\[(?!nid:).*?\]\]/s", $text, $matches, PREG_SET_ORDER);
  foreach ($matches as $match) {
    $hash_key = media_wysiwyg_get_token_key($match[0]);
    if (empty($tagmap[$hash_key])) {
      if ($markup_for_media = media_wysiwyg_token_to_markup($match[0], TRUE)) {
        $tagmap[$hash_key] = $markup_for_media;
      }
      else {
        $missing = file_create_url(drupal_get_path('module', 'media') . '/images/icons/default/image-x-generic.png');
        $tagmap[$hash_key] = '<div><img src="' . $missing . '" width="100px" height="100px"/></div>';
      }
    }
  }
  return $tagmap;
}

/**
 * Return a list of view modes allowed for a file embedded in the WYSIWYG.
 *
 * @param object $file
 *   A file entity.
 *
 * @return array
 *   An array of view modes that can be used on the file when embedded in the
 *   WYSIWYG.
 *
 * @deprecated
 */
function media_wysiwyg_get_wysiwyg_allowed_view_modes($file) {
  $enabled_view_modes = &drupal_static(__FUNCTION__, array());

  // @todo Add more caching for this.
  if (!isset($enabled_view_modes[$file->type])) {
    $enabled_view_modes[$file->type] = array();

    // Add the default view mode by default.
    $enabled_view_modes[$file->type]['default'] = array('label' => t('Default'), 'custom settings' => TRUE);

    $entity_info = entity_get_info('file');
    $view_mode_settings = field_view_mode_settings('file', $file->type);
    foreach ($entity_info['view modes'] as $view_mode => $view_mode_info) {
      // Do not show view modes that don't have their own settings and will
      // only fall back to the default view mode.
      if (empty($view_mode_settings[$view_mode]['custom_settings'])) {
        continue;
      }

      // Don't present the user with an option to choose a view mode in which
      // the file is hidden.
      $extra_fields = field_extra_fields_get_display('file', $file->type, $view_mode);
      if (empty($extra_fields['file']['visible'])) {
        continue;
      }

      // Add the view mode to the list of enabled view modes.
      $enabled_view_modes[$file->type][$view_mode] = $view_mode_info;
    }
  }

  $view_modes = $enabled_view_modes[$file->type];
  media_wysiwyg_wysiwyg_allowed_view_modes_restrict($view_modes, $file);
  drupal_alter('media_wysiwyg_allowed_view_modes', $view_modes, $file);
  // Invoke the deprecated/misspelled alter hook as well.
  drupal_alter('media_wysiwyg_wysiwyg_allowed_view_modes', $view_modes, $file);
  return $view_modes;
}
/**
 * Do not show restricted view modes.
 */
function media_wysiwyg_wysiwyg_allowed_view_modes_restrict(&$view_modes, &$file) {
  $restricted_view_modes = db_query('SELECT display FROM {media_restrict_wysiwyg} WHERE type = :type', array(':type' => $file->type))->fetchCol();
  foreach ($restricted_view_modes as $restricted_view_mode) {
    if (array_key_exists($restricted_view_mode, $view_modes)) {
      unset($view_modes[$restricted_view_mode]);
    }
  }
}
/**
 * #pre_render callback: Modify the element if the render cache is filtered.
 */
function media_wysiwyg_pre_render_cached_filter($element) {
  // Remove contextual links since they are not compatible with cached filtered
  // text.
  if (isset($element['content']['#contextual_links'])) {
    unset($element['content']['#contextual_links']);
  }

  return $element;
}

/**
 * Get a suitable indexing key of media tokens.
 *
 * This has to match the client side equivalent
 * Drupal.media.WysiwygInstance.prototype.getTokenKey().
 */
function media_wysiwyg_get_token_key($token) {
  // The hash key has to be prefixed with a string due to the nature of
  // drupal_add_js() which renumbers numeric indexes to plain serial indexes. In
  // order to keep the index during the PHP/JS handshake we prefix it with
  // 'token-'.
  return 'token-' . media_wysiwyg_hash_code($token);
}

/**
 * PHP equivalent of Javascipt String.prototype.charCodeAt().
 */
function media_wysiwyg_char_code_at($str, $index) {
  $char = mb_substr($str, $index, 1, 'UTF-8');

  if (mb_check_encoding($char, 'UTF-8')) {
    $ret = mb_convert_encoding($char, 'UTF-32BE', 'UTF-8');
    return hexdec(bin2hex($ret));
  }
  else {
    return NULL;
  }
}

/**
 * Generate integer hash of string.
 *
 * Rip-off from:
 * http://www.erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
 *
 * This function has to match its javascript sibling implementation. The
 * client-side hash has to be the same as this.
 *
 * @param string $str
 *   String to generate hash from.
 *
 * @see media_wysiwyg.utils.js:Drupal.media.utils.hashCode()
 *
 * @return int
 *   The generated hash code as integer.
 */
function media_wysiwyg_hash_code($str) {
  $hash = 0;
  $length = mb_strlen($str, 'UTF-8');

  if ($length == 0) {
    return $hash;
  }
  for ($i = 0; $i < $length; $i++) {
    $char = media_wysiwyg_char_code_at($str, $i);

    $hash = (($hash << 5) - $hash) + $char;
    // Convert to 31bit integer, omitting signed/unsigned compatibility issues
    // between php and js.
    $hash &= 0x7fffffff;
  }

  return $hash;
}
