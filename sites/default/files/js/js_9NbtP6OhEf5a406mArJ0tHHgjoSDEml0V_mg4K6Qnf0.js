Drupal.locale = { 'pluralFormula': function ($n) { return Number(($n!=1)); }, 'strings': {"":{"An AJAX HTTP error occurred.":"Ocorreu um erro HTTP no AJAX","HTTP Result Code: !status":"C\u00f3digo do Resultado HTTP:  !status","An AJAX HTTP request terminated abnormally.":"Uma requisi\u00e7\u00e3o HTTP AJAX terminou de forma inesperada.","Debugging information follows.":"Estas s\u00e3o as informa\u00e7\u00f5es de depura\u00e7\u00e3o.","Path: !uri":"Caminho: !uri","StatusText: !statusText":"Texto de Status: !statusText","ResponseText: !responseText":"Texto de Resposta: !responseText","ReadyState: !readyState":"ReadyState: !readyState","Hide":"Ocultar","Show":"Exibir","Show shortcuts":"Mostrar atalhos","Hide shortcuts":"Esconder atalhos","Status":"Status","Disabled":"Desativado","Enabled":"Habilitado","Edit":"Editar","Size":"Tamanho","none":"nenhum","Add":"Adicionar","Filename":"Nome do arquivo","Upload":"Upload","Configure":"Configurar","Done":"Conclu\u00eddo","N\/A":"-","OK":"OK","Allowed HTML tags":"Tags HTML permitidas","Select all rows in this table":"Selecionar todas as linhas da tabela","Deselect all rows in this table":"Desmarcar todas as linhas da tabela","Not published":"N\u00e3o publicado","Please wait...":"Por favor, aguarde...","Loading":"Carregando","Only files with the following extensions are allowed: %files-allowed.":"Apenas arquivos com as seguintes extens\u00f5es s\u00e3o permitidos: %files-allowed.","By @name on @date":"Por @name em @date","By @name":"Por @name","Not in menu":"Fora do menu","Alias: @alias":"URL Alternativa: @alias","No alias":"Nenhuma URL alternativa","New revision":"Nova revis\u00e3o","Drag to re-order":"Arraste para reordenar","Changes made in this table will not be saved until the form is submitted.":"As mudan\u00e7as feitas nesta tabela n\u00e3o v\u00e3o ser salvas antes do formul\u00e1rio ser enviado.","The changes to these blocks will not be saved until the \u003Cem\u003ESave blocks\u003C\/em\u003E button is clicked.":"As altera\u00e7\u00f5es nesses blocos n\u00e3o v\u00e3o ser salvas enquanto o bot\u00e3o \u003Cem\u003ESalvar Blocos\u003C\/em\u003E n\u00e3o for clicado.","This permission is inherited from the authenticated user role.":"Essa permiss\u00e3o \u00e9 herdada do papel de usu\u00e1rio autenticado.","No revision":"Sem revis\u00e3o","@number comments per page":"@number coment\u00e1rios por p\u00e1gina","Requires a title":"T\u00edtulo requerido","Not restricted":"Sem restri\u00e7\u00f5es","(active tab)":"(aba ativa)","Not customizable":"N\u00e3o \u00e9 personaliz\u00e1vel","Restricted to certain pages":"Restrito para certas p\u00e1ginas","The block cannot be placed in this region.":"O bloco n\u00e3o pode ser colocado nessa regi\u00e3o.","Customize dashboard":"Personalizar painel","Hide summary":"Ocultar sum\u00e1rio","Edit summary":"Editar resumo","Don\u0027t display post information":"N\u00e3o exibir informa\u00e7\u00f5es de postagem","@title dialog":"Di\u00e1logo @title","The selected file %filename cannot be uploaded. Only files with the following extensions are allowed: %extensions.":"O arquivo selecionado %filename n\u00e3o p\u00f4de ser transferido. Somente arquivos com as seguintes extens\u00f5es s\u00e3o permitidos: %extensions.","Re-order rows by numerical weight instead of dragging.":"Re-ordernar as linhas por campos n\u00famericos de peso ao inv\u00e9s de arrastar-e-soltar.","Show row weights":"Exibir pesos das linhas","Hide row weights":"Ocultar pesos das linhas","Autocomplete popup":"Popup de autocompletar","Searching for matches...":"Procurando por dados correspondentes...","Automatic alias":"Endere\u00e7o autom\u00e1tico","You can not perform this operation.":"Voc\u00ea n\u00e3o pode executar esta opera\u00e7\u00e3o.","Do you want to refresh the current directory?":"Voc\u00ea deseja recarregar o diret\u00f3rio atual?","Delete selected files?":"Apagar os arquivos selecionados?","Please select a thumbnail.":"Por favor selecione uma miniatura.","Please specify dimensions within the allowed range that is from 1x1 to @dimensions.":"Por favor, especifique as dimens\u00f5es dentro do intervalo permitido que \u00e9 de 1x1 para @dimensions.","Please select a file.":"Por favor, selecione um arquivo.","Log messages":"Mensagens de log","%filename is not an image.":"%filename n\u00e3o \u00e9 uma imagem.","You must select at least %num files.":"Voc\u00ea deve selecionar no m\u00ednimo %num arquivos.","You are not allowed to operate on more than %num files.":"Voc\u00ea n\u00e3o tem permiss\u00e3o para operar em mais de %num arquivos.","Close":"Fechar","Insert file":"Inserir arquivo","all":"todos","Change view":"Alterar vis\u00e3o"}} };;
(function ($) {

/**
 * Attaches double-click behavior to toggle full path of Krumo elements.
 */
Drupal.behaviors.devel = {
  attach: function (context, settings) {

    // Add hint to footnote
    $('.krumo-footnote .krumo-call').once().before('<img style="vertical-align: middle;" title="Click to expand. Double-click to show path." src="' + settings.basePath + 'misc/help.png"/>');

    var krumo_name = [];
    var krumo_type = [];

    function krumo_traverse(el) {
      krumo_name.push($(el).html());
      krumo_type.push($(el).siblings('em').html().match(/\w*/)[0]);

      if ($(el).closest('.krumo-nest').length > 0) {
        krumo_traverse($(el).closest('.krumo-nest').prev().find('.krumo-name'));
      }
    }

    $('.krumo-child > div:first-child', context).dblclick(
      function(e) {
        if ($(this).find('> .krumo-php-path').length > 0) {
          // Remove path if shown.
          $(this).find('> .krumo-php-path').remove();
        }
        else {
          // Get elements.
          krumo_traverse($(this).find('> a.krumo-name'));

          // Create path.
          var krumo_path_string = '';
          for (var i = krumo_name.length - 1; i >= 0; --i) {
            // Start element.
            if ((krumo_name.length - 1) == i)
              krumo_path_string += '$' + krumo_name[i];

            if (typeof krumo_name[(i-1)] !== 'undefined') {
              if (krumo_type[i] == 'Array') {
                krumo_path_string += "[";
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += krumo_name[(i-1)];
                if (!/^\d*$/.test(krumo_name[(i-1)]))
                  krumo_path_string += "'";
                krumo_path_string += "]";
              }
              if (krumo_type[i] == 'Object')
                krumo_path_string += '->' + krumo_name[(i-1)];
            }
          }
          $(this).append('<div class="krumo-php-path" style="font-family: Courier, monospace; font-weight: bold;">' + krumo_path_string + '</div>');

          // Reset arrays.
          krumo_name = [];
          krumo_type = [];
        }
      }
    );
  }
};

})(jQuery);
;
(function ($) {

Drupal.behaviors.textarea = {
  attach: function (context, settings) {
    $('.form-textarea-wrapper.resizable', context).once('textarea', function () {
      var staticOffset = null;
      var textarea = $(this).addClass('resizable-textarea').find('textarea');
      var grippie = $('<div class="grippie"></div>').mousedown(startDrag);

      grippie.insertAfter(textarea);

      function startDrag(e) {
        staticOffset = textarea.height() - e.pageY;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
      }

      function performDrag(e) {
        textarea.height(Math.max(32, staticOffset + e.pageY) + 'px');
        return false;
      }

      function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
      }
    });
  }
};

})(jQuery);
;

/**
 * @file: Popup dialog interfaces for the media project.
 *
 * Drupal.media.popups.mediaBrowser
 *   Launches the media browser which allows users to pick a piece of media.
 *
 * Drupal.media.popups.mediaStyleSelector
 *  Launches the media instance settings form where the user can configure the
 *  view mode and misc other settings related to given media instance.
 */

(function ($) {
namespace('Drupal.media.popups');

/**
 * Media browser popup. Creates a media browser dialog.
 *
 * @param {function}
 *   onSelect Callback for when dialog is closed, received (Array media, Object
 *   extra);
 * @param {Object}
 *   globalOptions Global options that will get passed upon initialization of
 *   the browser. @see Drupal.media.popups.mediaBrowser.getDefaults();
 * @param {Object}
 *   pluginOptions Options for specific plugins. These are passed to the plugin
 *   upon initialization.  If a function is passed here as a callback, it is
 *   obviously not passed, but is accessible to the plugin in
 *   Drupal.settings.variables. Example:
 *   pluginOptions = {library: {url_include_patterns:'/foo/bar'}};
 * @param {Object}
 *   widgetOptions Options controlling the appearance and behavior of the modal
 *   dialog. @see Drupal.media.popups.mediaBrowser.getDefaults();
 */
Drupal.media.popups.mediaBrowser = function (onSelect, globalOptions, pluginOptions, widgetOptions) {
  // Get default dialog options.
  var options = Drupal.media.popups.mediaBrowser.getDefaults();

  // Add global, plugin and widget options.
  options.global = $.extend({}, options.global, globalOptions);
  options.plugins = pluginOptions;
  options.widget = $.extend({}, options.widget, widgetOptions);

  // Find the URL of the modal iFrame.
  var browserSrc = options.widget.src;

  if ($.isArray(browserSrc) && browserSrc.length) {
    browserSrc = browserSrc[browserSrc.length - 1];
  }

  // Create an array of parameters to send along to the iFrame.
  var params = {};

  // Add global field widget settings and plugin information.
  $.extend(params, options.global);
  params.plugins = options.plugins;

  // Append the list of parameters to the iFrame URL as query parameters.
  browserSrc += '&' + $.param(params);

  // Create an iFrame with the iFrame URL.
  var mediaIframe = Drupal.media.popups.getPopupIframe(browserSrc, 'mediaBrowser');

  // Attach an onLoad event.
  mediaIframe.bind('load', options, options.widget.onLoad);

  // Create an array of Dialog options.
  var dialogOptions = options.dialog;

  // Setup the dialog buttons.
  var ok = Drupal.t('OK');
  var notSelected = Drupal.t('You have not selected anything!');

  dialogOptions.buttons[ok] = function () {
    // Find the current file selection.
    var selected = this.contentWindow.Drupal.media.browser.selectedMedia;

    // Alert the user if a selection has yet to be made.
    if (selected.length < 1) {
      alert(notSelected);

      return;
    }

    // Select the file.
    onSelect(selected);

    // Close the dialog.
    $(this).dialog('close');
  };

  // Create a jQuery UI dialog with the given options.
  var dialog = mediaIframe.dialog(dialogOptions);

  // Allow the dialog to react to re-sizing, scrolling, etc.
  Drupal.media.popups.sizeDialog(dialog);
  Drupal.media.popups.resizeDialog(dialog);
  Drupal.media.popups.scrollDialog(dialog);
  Drupal.media.popups.overlayDisplace(dialog.parents(".ui-dialog"));

  return mediaIframe;
};

/**
 * Retrieves a list of default settings for the media browser.
 *
 * @return
 *   An array of default settings.
 */
Drupal.media.popups.mediaBrowser.getDefaults = function () {
  return {
    global: {
      types: [], // Types to allow, defaults to all.
      enabledPlugins: [] // If provided, a list of plugins which should be enabled.
    },
    widget: { // Settings for the actual iFrame which is launched.
      src: Drupal.settings.media.browserUrl, // Src of the media browser (if you want to totally override it)
      onLoad: Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad // Onload function when iFrame loads.
    },
    dialog: Drupal.media.popups.getDialogOptions()
  };
};

/**
 * Sets up the iFrame buttons.
 */
Drupal.media.popups.mediaBrowser.mediaBrowserOnLoad = function (e) {
  var options = e.data;

  // Ensure that the iFrame is defined.
  if (typeof this.contentWindow.Drupal.media === 'undefined' || typeof
  this.contentWindow.Drupal.media.browser === 'undefined') {
    return;
  }

  // Check if a selection has been made and press the 'ok' button.
  if (this.contentWindow.Drupal.media.browser.selectedMedia.length > 0) {
    var ok = Drupal.t('OK');
    var ok_func = $(this).dialog('option', 'buttons')[ok];

    ok_func.call(this);

    return;
  }
};

/**
 * Finalizes the selection of a file.
 *
 * Alerts the user if a selection has yet to be made, triggers the file
 * selection and closes the modal dialog.
 */
Drupal.media.popups.mediaBrowser.finalizeSelection = function () {
  // Find the current file selection.
  var selected = this.contentWindow.Drupal.media.browser.selectedMedia;

  // Alert the user if a selection has yet to be made.
  if (selected.length < 1) {
    alert(notSelected);

    return;
  }

  // Select the file.
  onSelect(selected);

  // Close the dialog.
  $(this).dialog('close');
};

/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *   The mediaFile you are requesting this formatting form for.
 *   @todo: should this be fid? That's actually all we need now.
 *
 * @param Function
 *   onSubmit Function to be called when the user chooses a media style. Takes
 *   one parameter (Object formattedMedia).
 *
 * @param Object
 *   options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaStyleSelector = function (mediaFile, onSelect, options) {
  var defaults = Drupal.media.popups.mediaStyleSelector.getDefaults();

  // @todo: remove this awful hack :(
  if (typeof defaults.src === 'string' ) {
    defaults.src = defaults.src.replace('-media_id-', mediaFile.fid) + '&instance_settings=' + encodeURIComponent(JSON.stringify(mediaFile));
  }
  else {
    var src = defaults.src.shift();

    defaults.src.unshift(src);
    defaults.src = src.replace('-media_id-', mediaFile.fid) + '&instance_settings=' + encodeURIComponent(JSON.stringify(mediaFile));
  }

  options = $.extend({}, defaults, options);

  // Create an iFrame with the iFrame URL.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaStyleSelector');

  // Attach an onLoad event.
  mediaIframe.bind('load', options, options.onLoad);

  // Create an array of Dialog options.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  // Setup the dialog buttons.
  var ok = Drupal.t('OK');
  var notSelected = Drupal.t('Very sorry, there was an unknown error embedding media.');

  dialogOptions.buttons[ok] = function () {
    // Find the current file selection.
    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();
    formattedMedia.options = $.extend({}, mediaFile, formattedMedia.options);
    // Alert the user if a selection has yet to be made.
    if (!formattedMedia) {
      alert(notSelected);

      return;
    }

    // Select the file.
    onSelect(formattedMedia);

    // Close the dialog.
    $(this).dialog('close');
  };

  // Create a jQuery UI dialog with the given options.
  var dialog = mediaIframe.dialog(dialogOptions);

  // Allow the dialog to react to re-sizing, scrolling, etc.
  Drupal.media.popups.sizeDialog(dialog);
  Drupal.media.popups.resizeDialog(dialog);
  Drupal.media.popups.scrollDialog(dialog);
  Drupal.media.popups.overlayDisplace(dialog.parents(".ui-dialog"));

  return mediaIframe;
};

Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad = function (e) {
};

Drupal.media.popups.mediaStyleSelector.getDefaults = function () {
  return {
    src: Drupal.settings.media.styleSelectorUrl,
    onLoad: Drupal.media.popups.mediaStyleSelector.mediaBrowserOnLoad
  };
};

/**
 * Style chooser Popup. Creates a dialog for a user to choose a media style.
 *
 * @param mediaFile
 *   The mediaFile you are requesting this formatting form for.
 *   @todo: should this be fid? That's actually all we need now.
 *
 * @param Function
 *   onSubmit Function to be called when the user chooses a media style. Takes
 *   one parameter (Object formattedMedia).
 *
 * @param Object
 *   options Options for the mediaStyleChooser dialog.
 */
Drupal.media.popups.mediaFieldEditor = function (fid, onSelect, options) {
  var defaults = Drupal.media.popups.mediaFieldEditor.getDefaults();

  // @todo: remove this awful hack :(
  defaults.src = defaults.src.replace('-media_id-', fid);
  options = $.extend({}, defaults, options);

  // Create an iFrame with the iFrame URL.
  var mediaIframe = Drupal.media.popups.getPopupIframe(options.src, 'mediaFieldEditor');

  // Attach an onLoad event.
  mediaIframe.bind('load', options, options.onLoad);

  // Create an array of Dialog options.
  var dialogOptions = Drupal.media.popups.getDialogOptions();

  // Setup the dialog buttons.
  var ok = Drupal.t('OK');
  var notSelected = Drupal.t('Very sorry, there was an unknown error embedding media.');

  dialogOptions.buttons[ok] = function () {
    // Find the current file selection.
    var formattedMedia = this.contentWindow.Drupal.media.formatForm.getFormattedMedia();

    // Alert the user if a selection has yet to be made.
    if (!formattedMedia) {
      alert(notSelected);

      return;
    }

    // Select the file.
    onSelect(formattedMedia);

    // Close the dialog.
    $(this).dialog('close');
  };

  // Create a jQuery UI dialog with the given options.
  var dialog = mediaIframe.dialog(dialogOptions);

  // Allow the dialog to react to re-sizing, scrolling, etc.
  Drupal.media.popups.sizeDialog(dialog);
  Drupal.media.popups.resizeDialog(dialog);
  Drupal.media.popups.scrollDialog(dialog);
  Drupal.media.popups.overlayDisplace(dialog);

  return mediaIframe;
};

Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad = function (e) {

};

Drupal.media.popups.mediaFieldEditor.getDefaults = function () {
  return {
    // @todo: do this for real
    src: '/media/-media_id-/edit?render=media-popup',
    onLoad: Drupal.media.popups.mediaFieldEditor.mediaBrowserOnLoad
  };
};

/**
 * Generic functions to both the media-browser and style selector.
 */

/**
 * Returns the commonly used options for the dialog.
 */
Drupal.media.popups.getDialogOptions = function () {
  return {
    title: Drupal.t('Media browser'),
    buttons: {},
    dialogClass: Drupal.settings.media.dialogOptions.dialogclass,
    modal: Drupal.settings.media.dialogOptions.modal,
    draggable: Drupal.settings.media.dialogOptions.draggable,
    resizable: Drupal.settings.media.dialogOptions.resizable,
    minWidth: Drupal.settings.media.dialogOptions.minwidth,
    width: Drupal.settings.media.dialogOptions.width,
    height: Drupal.settings.media.dialogOptions.height,
    position: Drupal.settings.media.dialogOptions.position,
    overlay: {
      backgroundColor: Drupal.settings.media.dialogOptions.overlay.backgroundcolor,
      opacity: Drupal.settings.media.dialogOptions.overlay.opacity
    },
    zIndex: Drupal.settings.media.dialogOptions.zindex,
    close: function (event, ui) {
      var elem = $(event.target);
      var id = elem.attr('id');
      if(id == 'mediaStyleSelector') {
        $(this).dialog("destroy");
        $('#mediaStyleSelector').remove();
      }
      else {
        $(this).dialog("destroy");
        $('#mediaBrowser').remove();
      }
    }
  };
};

/**
 * Get an iframe to serve as the dialog's contents. Common to both plugins.
 */
Drupal.media.popups.getPopupIframe = function (src, id, options) {
  var defaults = {width: '100%', scrolling: 'auto'};
  var options = $.extend({}, defaults, options);

  return $('<iframe class="media-modal-frame" tabindex="0"/>')
  .attr('src', src)
  .attr('width', options.width)
  .attr('id', id)
  .attr('scrolling', options.scrolling);
};

Drupal.media.popups.overlayDisplace = function (dialog) {
  if (parent.window.Drupal.overlay && jQuery.isFunction(parent.window.Drupal.overlay.getDisplacement)) {
    var overlayDisplace = parent.window.Drupal.overlay.getDisplacement('top');

    if (dialog.offset().top < overlayDisplace) {
      dialog.css('top', overlayDisplace);
    }
  }
}

/**
 * Size the dialog when it is first loaded and keep it centered when scrolling.
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.sizeDialog = function (dialogElement) {
  if (!dialogElement.is(':visible')) {
    return;
  }

  var windowWidth = $(window).width();
  var dialogWidth = windowWidth * 0.8;
  var windowHeight = $(window).height();
  var dialogHeight = windowHeight * 0.8;

  dialogElement.dialog("option", "width", dialogWidth);
  dialogElement.dialog("option", "height", dialogHeight);
  dialogElement.dialog("option", "position", 'center');

  $('.media-modal-frame').width('100%');
}

/**
 * Resize the dialog when the window changes.
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.resizeDialog = function (dialogElement) {
  $(window).resize(function() {
    Drupal.media.popups.sizeDialog(dialogElement);
  });
}

/**
 * Keeps the dialog centered when the window is scrolled.
 *
 * @param jQuery dialogElement
 *  The element which has .dialog() attached to it.
 */
Drupal.media.popups.scrollDialog = function (dialogElement) {
  // Keep the dialog window centered when scrolling.
  $(window).scroll(function() {
    if (!dialogElement.is(':visible')) {
      return;
    }

    dialogElement.dialog("option", "position", 'center');
  });
}

})(jQuery);
;
(function ($) {

/**
 * Automatically display the guidelines of the selected text format.
 */
Drupal.behaviors.filterGuidelines = {
  attach: function (context) {
    $('.filter-guidelines', context).once('filter-guidelines')
      .find(':header').hide()
      .closest('.filter-wrapper').find('select.filter-list')
      .bind('change', function () {
        $(this).closest('.filter-wrapper')
          .find('.filter-guidelines-item').hide()
          .siblings('.filter-guidelines-' + this.value).show();
      })
      .change();
  }
};

})(jQuery);
;
/**
 * @file
 * Utilities useful for manipulating media in wysiwyg editors.
 */

(function ($) {

"use strict";

Drupal.media = Drupal.media || {};

Drupal.media.utils = {

  /**
   * Generate integer hash of string.
   *
   * Rip-off from:
   * http://www.erlycoder.com/49/javascript-hash-functions-to-convert-string-into-integer-hash-
   *
   * This method has to match its PHP sibling implementation. The server-side
   * hash has to be the same as this.
   *
   * @see media_wysiwyg.filter.inc:media_wysiwyg_hash_code().
   *
   * @param {string} str String to generate hash from.
   *
   * @return {number}
   *   The generated hash code as integer.
   */
  hashCode: function(str) {
    var hash = 0;
    var char;
    var i;

    if (str.length == 0) {
      return hash;
    }
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      // Convert to 31bit integer, omitting signed/unsigned compatibility issues
      // between php and js.
      hash &= 0x7fffffff;
    }
    return hash;
  },

  /**
   * Gets the HTML content of an element.
   *
   * Drupal 7 ships with JQuery 1.4.4, which allows $(this).attr('outerHTML') to
   * retrieve the element's HTML, but many sites use JQuery update and version
   * 1.6+, which insists on $(this).prop('outerHTML'). Until the minimum jQuery
   * is >= 1.6, we need to do this the old-school way. See
   * http://stackoverflow.com/questions/2419749/get-selected-elements-outer-html
   *
   * @param {jQuery} $element
   */
  outerHTML: function ($element) {
    return $element[0].outerHTML || $('<div>').append($element.eq(0).clone()).html();
  },

  /**
   * Assert that copied target is copied as new, not by reference.
   *
   * @param {mixed} src
   *   The value that should be copied.
   */
  copyAsNew: function(src) {
    return src instanceof Object ? $.extend(true, {}, src) : src;
  },

  /**
   * Find the first property in haystack that starts with needle.
   *
   * @param {string} needle
   *   The property starts with this string.
   * @param {object} haystack
   *   Object to search for matching property in.
   */
  propertyStartsWith(needle, haystack) {
    var property;
    for (property in haystack) {
      if (haystack.hasOwnProperty(property)) {
        if (property.startsWith(needle)) {
          return property;
        }
      }
    }
    return null;
  }

};

})(jQuery);
;
/**
 *  @file
 *  File with utilities to handle media in html editing.
 */
(function ($) {

  Drupal.media = Drupal.media || {};

  /**
   * Utility to deal with media tokens / placeholders.
   */
  Drupal.media.filter = {

    /**
     * @var {object} Map of media instances.
     */
    instanceMap: {},

    /**
     * Replaces media tokens with the placeholders for html editing.
     *
     * @param {string} content
     *   Text string (usually from textareas) to replace tokens in.
     *
     * @return {string}
     *   The given content as given with media tokens replaced with wysiwyg
     *   placeholder html equivalents.
     */
    replaceTokenWithPlaceholder: function(content) {
      var match, instance, markup;
      var matches = content.match(/\[\[.*?\]\]/g);

      if (!matches) {
        return content;
      }
      for (var i = 0; i < matches.length; i++) {
        match = matches[i];
        try {
          if ((instance = this.getMediaInstanceFromToken(match))) {
            instance.reloadPlaceholder();
          }
          else {
            instance = new Drupal.media.WysiwygInstance(match);
          }
          this.addMediaInstance(instance);
          markup = instance.getPlaceholderHtml();
        }
        catch (err) {
          // @todo: error logging.
          // Malformed or otherwise unusable token. Proceed to next.
          continue;
        }
        // Use split and join to replace all instances of macro with markup.
        content = content.split(match).join(markup);
      }
      return content;
    },

    /**
     * Replaces media placeholder elements with tokens.
     *
     * @param content (string)
     *   The markup within the wysiwyg instance.
     *
     * @return {string}
     *   The given content with wysiwyg placeholder code replaced with media
     *   tokens ready for input filtering.
     */
    replacePlaceholderWithToken: function(content) {
      // Locate and process all the media placeholders in the WYSIWYG content.
      // @todo: once baseline jQuery is 1.8+, switch to using
      // $.parseHTML(content)
      var $contentElements = $('<div/>');
      var self = this;
      $contentElements.get(0).innerHTML = content;
      $contentElements.find('.media-element').each(function () {
        var $placeholder = $(this);
        var mediaInstance = self.getMediaInstanceFromElement($placeholder);
        if (!mediaInstance) {
          return;
        }
        // Feed instance with current placeholder and make sure we still are
        // able to track it before replacing it with the token.
        mediaInstance.setPlaceholderFromWysiwyg($placeholder);
        self.addMediaInstance(mediaInstance);
        $(this).replaceWith(mediaInstance.getToken());
      });
      content = $contentElements.html();
      return content;
    },

    /**
     * Add and keep track of a media instance.
     *
     * @param {Drupal.media.WysiwygInstance} instance
     *   The instance to keep track of.
     *
     * @return {string}
     *   The index in this.instanceMap the instance was added to.
     */
    addMediaInstance: function(instance) {
      var key = instance.getKey();
      this.instanceMap[key] = instance;
      return key;
    },

    /**
     * Get media instance related to token.
     *
     * @param {string} token
     *   Find media instance based on this media token.
     *
     * @return {Drupal.media.WysiwygInstance}
     */
    getMediaInstanceFromToken: function(token) {
      var instanceKey = Drupal.media.WysiwygInstance.createKey(token);
      return instanceKey ? this.instanceMap[instanceKey] : null;
    },

    /**
     * Get media instance related to placeholder element.
     *
     * @param {jQuery} $element
     *   Placeholder element.
     *
     * @return {Drupal.media.WysiwygInstance}
     */
    getMediaInstanceFromElement: function($element) {
      var instanceKey = $element.attr('data-media-key');
      var instance = null;
      if (instanceKey) {
        instance = this.instanceMap[instanceKey];
      }
      return instance;
    }

  };

})(jQuery);
;
/**
 *  @file
 *  Utilities related to one inserted media instance in text areas.
 */

(function ($) {
"use strict";

Drupal.media = Drupal.media || {};

/**
 * Wysiwyg media instance handling.
 *
 * This class unites everything related to one media instance in wysiwyg
 * environments. Its a map and logic around the moving pieces of the game:
 * - The media token: as JSON-encoded string encapsulated in double brackets.
 * - The media instance settings: an object with all settings and attributes in
     play.
 * - The wysiwyg placeholder element: The element present in wysiwyg editors as
     a jQuery object.
 *
 * @param {string|object} instanceInfo
 *   This should either be the token as it exists in textareas, including
 *   opening '[[' and closing ']]' brackets, or the instance settings as an
 *   object, i.e. the parsed equivalent of the token.
 * @param {string} placeholderBase
 *   Use this as media wysiwyg placeholder base/template to extend
 *   settings/attributes on. Required if this is a new media instance. Existing
 *   media instances will have this base available either from
 *   Drupal.settings.media.tagMap or from existing WysiwygInstance objects.
 */
Drupal.media.WysiwygInstance = function(instanceInfo, placeholderBase) {

  /**
   * @var {string} The full media token.
   */
  this.token = '';

  /**
   * @var {object} The settings for this media instance.
   *
   * This keeps information about view mode, alignment, attributes and
   * overridden fields. I.e. settings that are specific to this inserted
   * instance, independent of the file it belongs to. In effect, this is the
   * parsed version of this.token;
   */
  this.settings = null;

  /**
   * @var {string} Our unique index key.
   *
   * A hashed version of this object suitable for indexing inserted media
   * instance objects.
   */
  this.key = '';

  /**
   * @var {jQuery} Placeholder DOM element as jQuery object.
   */
  this.$placeholder = null;

  if (typeof instanceInfo === 'object') {
    this.settings = instanceInfo;
    this.verifySettings();
    // If an object was given, it probably comes from the server side
    // media_wysiwyg_format_form(). This adds the file type as well which is
    // required for figuring out what overridable fields are available for this
    // media instance. It's not part of the token schema, only used internally.
    if (this.settings.file_type) {
      Drupal.settings.media.fidTypeMap[this.settings.fid] = this.settings.file_type;
    }
  }
  else if (typeof instanceInfo === 'string') {
    this.token = instanceInfo;
  }
  if (placeholderBase) {
    this.setPlaceholderFromServer(placeholderBase);
  }
};

Drupal.media.WysiwygInstance.prototype = {

  /**
   * Get the current instance settings.
   *
   * @return {object}
   *   The media instance settings.
   *
   * @throws {string}
   *   If object is missing basic info.
   */
  getSettings: function() {
    if (!this.settings) {
      if (!this.token) {
        throw "Instance missing basic info";
      }
      this.settings = JSON.parse(this.token.replace('[[', '').replace(']]', ''));
      this.verifySettings();
    }
    return this.settings;
  },

  /**
   * Verify settings against media token schema.
   *
   * @throws {string}
   *   Error message if token doesn't fullfill schema spec.
   */
  verifySettings: function() {
    var property, propSettings;
    var self = this;
    if (!this.settings) {
      throw "Invalid state: Cannot verify settings without settings.";
    }
    $.each(Drupal.settings.media.tokenSchema, function(property, propSettings) {
      var settingValue;
      if (propSettings.required) {
        if (!self.settings[property]) {
          throw "Media token parse error: Missing required property '" + property + "'.";
        }
      }
      else {
        if (!self.settings[property]) {
          // For empty values, use the default value from schema to assert its type.
          self.settings[property] = Drupal.media.utils.copyAsNew(propSettings.default);
        }
      }
      if (propSettings.options !== undefined && self.settings[property]) {
        settingValue = self.settings[property];
        if (!propSettings.options[settingValue]) {
          // Add default value instead of throwing exception. At least the
          // editor will have something to work with.
          // @todo: Error logging/message about malformed token?
          self.settings[property] = propSettings.default;
        }
      }
    });
    if (this.settings.type !== 'media') {
      throw "Token not of type 'media'.";
    }
  },

  /**
   * Get the media token for this instance.
   *
   * @return {string}
   *   The media token including opening '[[' and closing ']]' brackets.
   */
  getToken: function() {
    if (this.token) {
      return this.token;
    }
    var settings = this.getSettings();
    if (typeof settings.link_text == 'string') {
      settings.link_text = this.overrideLinkTitle();
      // Make sure the link_text-html-tags are properly escaped.
      settings.link_text = settings.link_text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    this.token = '[[' + JSON.stringify(this.prepareSettingsForToken()) + ']]';
    return this.token;
  },

  /**
   * Get this instance's indexable key.
   *
   * @return {string}
   *   Instance indexable key.
   */
  getKey: function() {
    if (!this.key) {
      this.key = Drupal.media.WysiwygInstance.createKey(this.getToken());
    }
    return this.key;
  },

  /**
   * Prepare and set placeholder from server for wysiwyg.
   *
   * Placeholders given from rendered file entities comes in various form and
   * formats. Prepare it by removing link wrappers, assert it has a valid tag
   * and apply the instance settings on it, making it ready for inserting in
   * wysiwyg environments.
   *
   * @param {string} placeholder
   *   The placeholder coming from Drupal.
   */
  setPlaceholderFromServer: function(placeholder) {
    if ($('<div>').append(placeholder).text().length === placeholder.length) {
      // Element is a #text node and needs to be wrapped in a HTML element so
      // attributes can be attached.
      placeholder = '<span>' + placeholder + '</span>';
    }
    this.$placeholder = $(placeholder);
    // Parse out link wrappers.
    // @todo Fix link management for wysiwyg media.
    // @see #2918848.
    if (this.$placeholder.is('a') && this.$placeholder.find('img').length) {
      this.$placeholder = this.$placeholder.children();
    }
    this.syncSettingsToPlaceholder();
  },

  /**
   * Set the placeholder from Wysiwyg environment.
   *
   * Calling this informs this instance that the given placeholder is the
   * dominant source of media instance state. This will update the instance
   * settings and reset the token and key.
   *
   * @param {jQuery} $placeholder.
   *   The wysiwyg media placeholder.
   */
  setPlaceholderFromWysiwyg: function($placeholder) {
    this.$placeholder = $placeholder;
    this.syncPlaceholderToSettings();
  },

  /**
   * Get the wysiwyg placeholder as jQuery element.
   *
   * @return {jQuery}
   */
  getPlaceholder: function() {
    var placeholderBase;

    if (this.$placeholder) {
      return this.$placeholder;
    }
    if (!(placeholderBase = Drupal.settings.media.tagMap[this.getKey()])) {
      // The token is no longer the same as server-side, and the server-side
      // rendered html template based on this token is no longer available.
      // @todo: Feature parity with 3.x require map between fid and base html.
      throw "Unable to retrieve media html.";
    }
    this.setPlaceholderFromServer(placeholderBase);
    return this.$placeholder;
  },

  /**
   * Get a HTML representation of media token suitable for wysiwyg editors.
   *
   * @return {string}
   *   HTML representation of instance wysiwyg placeholder.
   */
  getPlaceholderHtml: function() {
    return Drupal.media.utils.outerHTML(this.getPlaceholder());
  },

  /**
   * Reload placeholder according to settings.
   *
   * This resets the placeholder to a 'clean' state and builds it up again based
   * on this instance's settings.
   */
  reloadPlaceholder() {
    if (!this.getPlaceholder()) {
      throw "Invalid state: Placeholder missing";
    }
    this.resetPlaceholderAttributes();
    this.syncSettingsToPlaceholder();
  },

  /**
   * Remove generated attributes on wysiwyg placeholder.
   *
   * Some attributes and classes are generated and added to placeholder elements
   * based on instance settings, and the mere fact that they are media elements.
   * This method resets the placeholder element so no attributes are
   * unnecessarily present.
   */
  resetPlaceholderAttributes: function() {
    if (!this.$placeholder) {
      throw "Invalid state: Instance placeholder is missing.";
    }

    // Remove any existing view mode classes, alignment classes and various data
    // attributes related to media management.
    this.removePlaceholderAlignment();
    this.$placeholder.removeClass(function (index, css) {
      return (css.match(/\bfile-\S+/g) || []).join(' ');
    }).removeClass('media-element')
      .removeAttr('data-fid')
      .removeAttr('data-media-element')
      .removeAttr('data-media-key');
  },

  /**
   * Get current alignment for instance.
   */
  getAlignment: function() {
    var settings = this.getSettings();
    return settings.alignment;
  },

  /**
   * Align instance.
   *
   * @param {string} value
   *   The alignment value. Allowed values are 'left', 'center' or 'right'.
   * @param {bool} toggle
   *   Optional. Set this to true to toggle alignment on or off based on current
   *   alignment.
   *
   * @return {bool}
   *   true if alignment was set to given value, false otherwise.
   */
  setAlignment: function(value, toggle) {
    var currentAlignment = this.getAlignment();
    if (currentAlignment == value) {
      if (toggle) {
        this.removePlaceholderAlignment();
        this.settings.alignment = '';
        return false;
      }
      return true;
    }
    else {
      if (currentAlignment) {
        this.removePlaceholderAlignment();
      }
      this.$placeholder.addClass('media-wysiwyg-align-' + value);
      this.settings.alignment = value;
      this.token = this.key = '';
      return true;
    }
  },

  /**
   * Remove any alignment methods from placeholder.
   */
  removePlaceholderAlignment: function() {
    this.$placeholder.removeClass(function (index, css) {
      return (css.match(/\bmedia-wysiwyg-align-\S+/g) || []).join(' ');
    }).removeAttr('align')
      .css('float', '');
  },

  /**
   * Sync state from settings to wysiwyg placeholder element.
   */
  syncSettingsToPlaceholder: function() {
    var attributes, classes;
    var settings = this.getSettings();
    var self = this;

    if (!this.$placeholder) {
      throw "Invalid state: Instance placeholder is missing.";
    }

    this.syncFieldsToAttributes();

    // Move attributes from instance settings to the placeholder element.
    if (settings.attributes) {
      $.each(Drupal.settings.media.wysiwygAllowedAttributes, function(i, allowed_attribute) {
        if (settings.attributes[allowed_attribute]) {
          self.$placeholder.attr(allowed_attribute, settings.attributes[allowed_attribute]);
        }
        else if (self.$placeholder.attr(allowed_attribute)) {
          // If the element has the attribute, but the value is empty, be sure
          // to clear it.
          self.$placeholder.removeAttr(allowed_attribute);
        }
      });
      delete(settings.attributes);
    }
    // Reset placeholder element and start generating various attributes and
    // classes based on instance settings and custom attributes.
    this.resetPlaceholderAttributes();
    this.$placeholder
      .attr('data-fid', settings.fid)
      .attr('data-media-key', this.getKey());
    classes = ['media-element', 'file-' + settings.view_mode.replace(/_/g, '-')];
    if (settings.alignment) {
      classes.push('media-wysiwyg-align-' + settings.alignment);
    }
    this.$placeholder.addClass(classes.join(' '));

    // Attempt to override the link_title if the user has chosen to do this.
    settings.link_text = this.overrideLinkTitle();
    // Apply link_text if present.
    if ((settings.link_text) && (!settings.external_url || settings.external_url.length === 0)) {
      $('a', this.$placeholder).html(settings.link_text);
    }
  },

  /**
   * Sync state in wysiwyg placeholder element back to settings.
   */
  syncPlaceholderToSettings: function() {
    var value;
    var $placeholder = this.getPlaceholder();
    var settings = this.getSettings();

    // Attributes. Start with flushing out attributes from settings. Insert
    // allowed attributes from placeholder to settings.attributes, and finally
    // sync attributes that are fed by fields back to their respective field ID.
    settings.attributes = {};
    $.each(Drupal.settings.media.wysiwygAllowedAttributes, function(i, allowed_attribute) {
      if ((value = $placeholder.attr(allowed_attribute))) {
        // Replace &quot; by \" to avoid error with JSON format.
        if (typeof value == 'string') {
          value = value.replace('&quot;', '\\"');
        }
        settings.attributes[allowed_attribute] = value;
      }
    });
    this.syncAttributesToFields();
    this.aggregateAlignmentFromAttributes();

    // Extract the link text, if there is any.
    settings.link_text = (Drupal.settings.media.doLinkText) ? $placeholder.find('a:not(:has(img))').html() : false;
    // The placeholder and this.settings are now the correct 'owner' of this
    // instance, and the generated token and key, if any is outdated. These have
    // to be regenerated in order to get a new data-fid-key attribute in place.
    this.token = '';
    this.key = '';
  },

  /**
   * Aggregate various alignment methods to settings.alignment.
   *
   * Wysiwyg editors are free to set media alignment either with the 'align'
   * attribute or inline css float, i.e. use other methods of alignment than the
   * text justify buttons or media instance settings for alignment. The goal
   * here is to aggregate the alignment the user actually *see* in the wysiwyg
   * editor, so the aggregation follows the following priority of alignment:
   *
   *   1. inline css float.
   *   2. 'media-wysiwyg-align-*' class
   *   3. 'align' attribute.
   *   4. settings.alignment.
   */
  aggregateAlignmentFromAttributes: function() {
    var classes, rules;
    var alignment = '';
    var settings = this.getSettings();
    var css = {};

    // 3. alignment attribute
    if (settings.attributes.align == 'left' || settings.attributes.align == 'right') {
      settings.alignment = settings.attributes.align;
      delete settings.attributes.align;
    }

    // 2. classes
    if (settings.attributes.class) {
      classes = settings.attributes.class.split (' ');
      classes = classes.filter(function (className) {
        var match = className.match(/^media-wysiwyg-align-(left|right|center)$/);
        if (match) {
          alignment = match[1];
          return false;
        }
        return true;
      });
      if (alignment) {
        settings.alignment = alignment;
        if (classes) {
          settings.attributes.class = classes.join(' ');
        }
        else {
          delete settings.attributes.class;
        }
      }
    }

    // 1. inline style and float.
    if (settings.attributes.style) {
      rules = settings.attributes.style.split(';');
      rules.forEach(function(rule) {
        var i = rule.indexOf(':');
        var property = rule.slice(0, i).trim();
        var value = rule.slice(i + 1).trim();
        if (property && value) {
          css[property] = value;
        }
      });
      if (css.float && (css.float == 'left' || css.float == 'right')) {
        settings.alignment = css.float;
        delete css.float;
        rules = [];
        $.each(css, function(property, value) {
          rules.push(property + ':' + value);
        });
        if (rules.length) {
          settings.attributes.style = rules.join(';');
        }
        else {
          delete settings.attributes.style;
        }
      }
    }
  },

  /**
   * Sync attributes to fields.
   *
   * file_entity.module uses some fields to set certain attributes (alt, title)
   * on media elements. During wysiwyg editing these attributes may be
   * overridden and needs to be synced back to fields. This operation only syncs
   * values internally on the this.settings object between field properties and
   * the settings.attributes object.
   *
   * @param {bool} reverse
   *   Optional. Sync the oposite way: Sync fields to attributes.
   */
  syncAttributesToFields: function(reverse) {
    var fieldId;
    var settings = this.getSettings();

    if (!settings.attributes) {
      settings.attributes = {};
    }
    $.each(Drupal.settings.media.attributeFields, function(attribute, fieldName) {
      fieldId = Drupal.media.utils.propertyStartsWith(fieldName + '[', settings);
      if (!reverse) {
        settings[fieldId] = settings.attributes[attribute] ? settings.attributes[attribute] : '';
      }
      else {
        if (settings[fieldId]) {
          settings.attributes[attribute] = settings[fieldId];
        }
        else {
          delete settings.attributes[attribute];
        }
      }
    });
  },

  /**
   * Sync fields with attribute data to the settings.attributes property.
   */
  syncFieldsToAttributes: function() {
    this.syncAttributesToFields(true);
  },

  /**
   * Prepare this media instance settings object for tokenization.
   *
   * During a page request the media instance settings (formely known as
   * file_info) is passed around a lot and tweaked and modified by various
   * mechanisms. This method prepares this object for final stringifycation by
   * removing temporary, duplicate and otherwise unnecessary properties.
   *
   * @return {object}
   *   A cloned and cleaned version of the given object, ready for
   *   stringifycation and final output.
   */
  prepareSettingsForToken: function() {
    var classes, property, attribute, type, field;
    var pristine = {};
    var settings = this.getSettings();

    $.each(Drupal.settings.media.tokenSchema, function(property) {
      if (settings[property]) {
        pristine[property] = Drupal.media.utils.copyAsNew(settings[property]);
      }
    });
    if (settings.instance_fields === "override") {
      // Copy all overridable fields that belong to this file type.
      $.each(Drupal.media.WysiwygInstance.getOverridableFields(settings.fid), function(field) {
        $.each(settings, function(property) {
          if (property.startsWith(field + '[')) {
            pristine[property] = settings[property];
          }
        });
      });
    }
    if (pristine.attributes) {
      // Remove attributes already present as fields.
      $.each(Drupal.settings.media.attributeFields, function(attribute) {
        delete pristine.attributes[attribute];
      });
      // Internal data attributes.
      delete pristine.attributes['data-fid'];
      delete pristine.attributes['data-media-element'];
      delete pristine.attributes["data-media-key"];
      // Remove class names that otherwise are generated during wysiwyg or
      // server side input filtering.
      if (pristine.attributes.class) {
        classes = pristine.attributes.class.split(' ');
        classes = classes.filter(function(className) {
          return !(className == 'media-element'
                  || /^file-\S+$/.test(className)
                  || /^media-wysiwyg-align-(left|right|center)$/.test(className));
        });
        if (classes.length) {
          pristine.attributes.class = classes.join(' ');
        }
        else {
          delete pristine.attributes.class;
        }
      }
      // Finally, if the overall attributes object is empty, just remove it.
      if (!Object.keys(pristine.attributes).length) {
        delete pristine.attributes;
      }
    }
    return pristine;
  },

  /**
   * Return the overridden link title based on the file_entity title field set.
   *
   * @return {string}
   *   The overridden link_title or the existing link text if no overridden.
   */
  overrideLinkTitle: function() {
    var settings = this.getSettings();
    if (!Drupal.settings.media.attributeFields.title) {
      return settings.link_text;
    }
    var file_title_field_machine_name = '';
    $.each(settings, function(field, fieldValue) {
      if (field.indexOf(Drupal.settings.media.attributeFields.title) != -1) {
        file_title_field_machine_name = field;
      }
    });

    if (typeof settings[file_title_field_machine_name] != 'undefined' && settings[file_title_field_machine_name] != '') {
      return settings[file_title_field_machine_name];
    }
    return settings.link_text;
  }

};

//
// Utility functions related to media wysiwyg instances.
//

/**
 * Get a key suitable for indexing data related to this instance.
 *
 * This key have to be possible to recreate both server- and client side, and as
 * such, only the media token can be used as hash salt. Also, without any
 * wysiwyg editors attached the token itself is the only source and owner of the
 * current inserted media.
 *
 * The server-side equivalent is media_wysiwyg_get_token_key();
 *
 * @param {string} token
 *   The full media token to create key of.
 *
 * @return {string}
 *   Client/server-side compatible key suitable for indexing.
 */
Drupal.media.WysiwygInstance.createKey = function(token) {
  return 'token-' + Drupal.media.utils.hashCode(token);
};

/**
 * Get the map of overridable fields for given file ID.
 *
 * @param {number} fid
 *   The file ID to find overridable fields for.
 *
 * @return {object}
 *   A map of overriable fields and their status.
 */
Drupal.media.WysiwygInstance.getOverridableFields = function(fid) {
  var type, fields;
  if ((type = Drupal.settings.media.fidTypeMap[fid]) && (fields = Drupal.settings.media.overridableFields[type])) {
    return fields;
  }
  return {};
};

})(jQuery);
;
(function ($) {

/**
 * Toggle the visibility of a fieldset using smooth animations.
 */
Drupal.toggleFieldset = function (fieldset) {
  var $fieldset = $(fieldset);
  if ($fieldset.is('.collapsed')) {
    var $content = $('> .fieldset-wrapper', fieldset).hide();
    $fieldset
      .removeClass('collapsed')
      .trigger({ type: 'collapsed', value: false })
      .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Hide'));
    $content.slideDown({
      duration: 'fast',
      easing: 'linear',
      complete: function () {
        Drupal.collapseScrollIntoView(fieldset);
        fieldset.animating = false;
      },
      step: function () {
        // Scroll the fieldset into view.
        Drupal.collapseScrollIntoView(fieldset);
      }
    });
  }
  else {
    $fieldset.trigger({ type: 'collapsed', value: true });
    $('> .fieldset-wrapper', fieldset).slideUp('fast', function () {
      $fieldset
        .addClass('collapsed')
        .find('> legend span.fieldset-legend-prefix').html(Drupal.t('Show'));
      fieldset.animating = false;
    });
  }
};

/**
 * Scroll a given fieldset into view as much as possible.
 */
Drupal.collapseScrollIntoView = function (node) {
  var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
  var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
  var posY = $(node).offset().top;
  var fudge = 55;
  if (posY + node.offsetHeight + fudge > h + offset) {
    if (node.offsetHeight > h) {
      window.scrollTo(0, posY);
    }
    else {
      window.scrollTo(0, posY + node.offsetHeight - h + fudge);
    }
  }
};

Drupal.behaviors.collapse = {
  attach: function (context, settings) {
    $('fieldset.collapsible', context).once('collapse', function () {
      var $fieldset = $(this);
      // Expand fieldset if there are errors inside, or if it contains an
      // element that is targeted by the URI fragment identifier.
      var anchor = location.hash && location.hash != '#' ? ', ' + location.hash : '';
      if ($fieldset.find('.error' + anchor).length) {
        $fieldset.removeClass('collapsed');
      }

      var summary = $('<span class="summary"></span>');
      $fieldset.
        bind('summaryUpdated', function () {
          var text = $.trim($fieldset.drupalGetSummary());
          summary.html(text ? ' (' + text + ')' : '');
        })
        .trigger('summaryUpdated');

      // Turn the legend into a clickable link, but retain span.fieldset-legend
      // for CSS positioning.
      var $legend = $('> legend .fieldset-legend', this);

      $('<span class="fieldset-legend-prefix element-invisible"></span>')
        .append($fieldset.hasClass('collapsed') ? Drupal.t('Show') : Drupal.t('Hide'))
        .prependTo($legend)
        .after(' ');

      // .wrapInner() does not retain bound events.
      var $link = $('<a class="fieldset-title" href="#"></a>')
        .prepend($legend.contents())
        .appendTo($legend)
        .click(function () {
          var fieldset = $fieldset.get(0);
          // Don't animate multiple times.
          if (!fieldset.animating) {
            fieldset.animating = true;
            Drupal.toggleFieldset(fieldset);
          }
          return false;
        });

      $legend.append(summary);
    });
  }
};

})(jQuery);
;
(function ($) {

/**
 * Provide the summary information for the block settings vertical tabs.
 */
Drupal.behaviors.blockSettingsSummary = {
  attach: function (context) {
    // The drupalSetSummary method required for this behavior is not available
    // on the Blocks administration page, so we need to make sure this
    // behavior is processed only if drupalSetSummary is defined.
    if (typeof jQuery.fn.drupalSetSummary == 'undefined') {
      return;
    }

    $('fieldset#edit-path', context).drupalSetSummary(function (context) {
      if (!$('textarea[name="pages"]', context).val()) {
        return Drupal.t('Not restricted');
      }
      else {
        return Drupal.t('Restricted to certain pages');
      }
    });

    $('fieldset#edit-node-type', context).drupalSetSummary(function (context) {
      var vals = [];
      $('input[type="checkbox"]:checked', context).each(function () {
        vals.push($.trim($(this).next('label').html()));
      });
      if (!vals.length) {
        vals.push(Drupal.t('Not restricted'));
      }
      return vals.join(', ');
    });

    $('fieldset#edit-role', context).drupalSetSummary(function (context) {
      var vals = [];
      $('input[type="checkbox"]:checked', context).each(function () {
        vals.push($.trim($(this).next('label').html()));
      });
      if (!vals.length) {
        vals.push(Drupal.t('Not restricted'));
      }
      return vals.join(', ');
    });

    $('fieldset#edit-user', context).drupalSetSummary(function (context) {
      var $radio = $('input[name="custom"]:checked', context);
      if ($radio.val() == 0) {
        return Drupal.t('Not customizable');
      }
      else {
        return $radio.next('label').html();
      }
    });
  }
};

/**
 * Move a block in the blocks table from one region to another via select list.
 *
 * This behavior is dependent on the tableDrag behavior, since it uses the
 * objects initialized in that behavior to update the row.
 */
Drupal.behaviors.blockDrag = {
  attach: function (context, settings) {
    // tableDrag is required and we should be on the blocks admin page.
    if (typeof Drupal.tableDrag == 'undefined' || typeof Drupal.tableDrag.blocks == 'undefined') {
      return;
    }

    var table = $('table#blocks');
    var tableDrag = Drupal.tableDrag.blocks; // Get the blocks tableDrag object.

    // Add a handler for when a row is swapped, update empty regions.
    tableDrag.row.prototype.onSwap = function (swappedRow) {
      checkEmptyRegions(table, this);
    };

    // A custom message for the blocks page specifically.
    Drupal.theme.tableDragChangedWarning = function () {
      return '<div class="messages warning">' + Drupal.theme('tableDragChangedMarker') + ' ' + Drupal.t('The changes to these blocks will not be saved until the <em>Save blocks</em> button is clicked.') + '</div>';
    };

    // Add a handler so when a row is dropped, update fields dropped into new regions.
    tableDrag.onDrop = function () {
      dragObject = this;
      // Use "region-message" row instead of "region" row because
      // "region-{region_name}-message" is less prone to regexp match errors.
      var regionRow = $(dragObject.rowObject.element).prevAll('tr.region-message').get(0);
      var regionName = regionRow.className.replace(/([^ ]+[ ]+)*region-([^ ]+)-message([ ]+[^ ]+)*/, '$2');
      var regionField = $('select.block-region-select', dragObject.rowObject.element);
      // Check whether the newly picked region is available for this block.
      if ($('option[value=' + regionName + ']', regionField).length == 0) {
        // If not, alert the user and keep the block in its old region setting.
        alert(Drupal.t('The block cannot be placed in this region.'));
        // Simulate that there was a selected element change, so the row is put
        // back to from where the user tried to drag it.
        regionField.change();
      }
      else if ($(dragObject.rowObject.element).prev('tr').is('.region-message')) {
        var weightField = $('select.block-weight', dragObject.rowObject.element);
        var oldRegionName = weightField[0].className.replace(/([^ ]+[ ]+)*block-weight-([^ ]+)([ ]+[^ ]+)*/, '$2');

        if (!regionField.is('.block-region-' + regionName)) {
          regionField.removeClass('block-region-' + oldRegionName).addClass('block-region-' + regionName);
          weightField.removeClass('block-weight-' + oldRegionName).addClass('block-weight-' + regionName);
          regionField.val(regionName);
        }
      }
    };

    // Add the behavior to each region select list.
    $('select.block-region-select', context).once('block-region-select', function () {
      $(this).change(function (event) {
        // Make our new row and select field.
        var row = $(this).closest('tr');
        var select = $(this);
        tableDrag.rowObject = new tableDrag.row(row);

        // Find the correct region and insert the row as the last in the region.
        table.find('.region-' + select[0].value + '-message').nextUntil('.region-message').last().before(row);

        // Modify empty regions with added or removed fields.
        checkEmptyRegions(table, row);
        // Remove focus from selectbox.
        select.get(0).blur();
      });
    });

    var checkEmptyRegions = function (table, rowObject) {
      $('tr.region-message', table).each(function () {
        // If the dragged row is in this region, but above the message row, swap it down one space.
        if ($(this).prev('tr').get(0) == rowObject.element) {
          // Prevent a recursion problem when using the keyboard to move rows up.
          if ((rowObject.method != 'keyboard' || rowObject.direction == 'down')) {
            rowObject.swap('after', this);
          }
        }
        // This region has become empty.
        if ($(this).next('tr').is(':not(.draggable)') || $(this).next('tr').length == 0) {
          $(this).removeClass('region-populated').addClass('region-empty');
        }
        // This region has become populated.
        else if ($(this).is('.region-empty')) {
          $(this).removeClass('region-empty').addClass('region-populated');
        }
      });
    };
  }
};

})(jQuery);
;
