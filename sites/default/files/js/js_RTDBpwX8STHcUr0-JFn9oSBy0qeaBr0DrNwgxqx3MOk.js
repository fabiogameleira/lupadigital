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
(function ($, Drupal) {
  /*global jQuery:false */
  /*global Drupal:false */
  "use strict";

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  Drupal.behaviors.govbrSettingSummaries = {
    attach: function (context) {
      var $context = $(context);

      // Global information.
      $context.find('#edit-info').drupalSetSummary(function () {
        var summary = [];
        // Designation.
        var designation = $context.find('input[name="govbr_theme_info_designation"]').val();
        if (designation) {
          summary.push(designation);
        }
        // Name
        var name = $context.find('input[name="govbr_theme_info_name"]').val();
        if (name) {
          summary.push(name);
        }
        // Subordination
        var subordination = $context.find('input[name="govbr_theme_info_subordination"]').val();
        if (subordination) {
          summary.push(subordination);
        }

        return summary.join("<br>");
      });

      // Color scheme.
      $context.find('#edit-color-scheme').drupalSetSummary(function () {
        var summary = [];
        // Scheme.
        var scheme = $('input[name="govbr_theme_color_scheme"]:checked');
        if (scheme.val()) {
          summary.push(Drupal.t('Selected scheme') + ': '+ scheme.val());
        }

        return summary.join(' ');
      });

      // Accessibility.
      $context.find('#edit-accessibility').drupalSetSummary(function () {
        var summary = [];
        // Shortcuts.
        var content = $context.find('input[name="govbr_theme_accessibility_shortcuts[content]"]');
        var menu = $context.find('input[name="govbr_theme_accessibility_shortcuts[menu]"]');
        var search = $context.find('input[name="govbr_theme_accessibility_shortcuts[search]"]');
        var footer = $context.find('input[name="govbr_theme_accessibility_shortcuts[footer]"]');

        if (content.is(':checked')) {
          summary.push(content.val());
        }
        if (menu.is(':checked')) {
          summary.push(menu.val());
        }
        if (search.is(':checked')) {
          summary.push(search.val());
        }
        if (footer.is(':checked')) {
          summary.push(footer.val());
        }

        return Drupal.t('Go to links:') + ' ' + summary.join(', ');
      });
    }
  };

})(jQuery, Drupal);
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
 * A progressbar object. Initialized with the given id. Must be inserted into
 * the DOM afterwards through progressBar.element.
 *
 * method is the function which will perform the HTTP request to get the
 * progress bar state. Either "GET" or "POST".
 *
 * e.g. pb = new progressBar('myProgressBar');
 *      some_element.appendChild(pb.element);
 */
Drupal.progressBar = function (id, updateCallback, method, errorCallback) {
  var pb = this;
  this.id = id;
  this.method = method || 'GET';
  this.updateCallback = updateCallback;
  this.errorCallback = errorCallback;

  // The WAI-ARIA setting aria-live="polite" will announce changes after users
  // have completed their current activity and not interrupt the screen reader.
  this.element = $('<div class="progress" aria-live="polite"></div>').attr('id', id);
  this.element.html('<div class="bar"><div class="filled"></div></div>' +
                    '<div class="percentage"></div>' +
                    '<div class="message">&nbsp;</div>');
};

/**
 * Set the percentage and status message for the progressbar.
 */
Drupal.progressBar.prototype.setProgress = function (percentage, message) {
  if (percentage >= 0 && percentage <= 100) {
    $('div.filled', this.element).css('width', percentage + '%');
    $('div.percentage', this.element).html(percentage + '%');
  }
  $('div.message', this.element).html(message);
  if (this.updateCallback) {
    this.updateCallback(percentage, message, this);
  }
};

/**
 * Start monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.startMonitoring = function (uri, delay) {
  this.delay = delay;
  this.uri = uri;
  this.sendPing();
};

/**
 * Stop monitoring progress via Ajax.
 */
Drupal.progressBar.prototype.stopMonitoring = function () {
  clearTimeout(this.timer);
  // This allows monitoring to be stopped from within the callback.
  this.uri = null;
};

/**
 * Request progress data from server.
 */
Drupal.progressBar.prototype.sendPing = function () {
  if (this.timer) {
    clearTimeout(this.timer);
  }
  if (this.uri) {
    var pb = this;
    // When doing a post request, you need non-null data. Otherwise a
    // HTTP 411 or HTTP 406 (with Apache mod_security) error may result.
    $.ajax({
      type: this.method,
      url: this.uri,
      data: '',
      dataType: 'json',
      success: function (progress) {
        // Display errors.
        if (progress.status == 0) {
          pb.displayError(progress.data);
          return;
        }
        // Update display.
        pb.setProgress(progress.percentage, progress.message);
        // Schedule next timer.
        pb.timer = setTimeout(function () { pb.sendPing(); }, pb.delay);
      },
      error: function (xmlhttp) {
        pb.displayError(Drupal.ajaxError(xmlhttp, pb.uri));
      }
    });
  }
};

/**
 * Display errors on the page.
 */
Drupal.progressBar.prototype.displayError = function (string) {
  var error = $('<div class="messages error"></div>').html(string);
  $(this.element).before(error).hide();

  if (this.errorCallback) {
    this.errorCallback(this);
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
(function ($, Drupal) {
  /*global jQuery:false */
  /*global Drupal:false */
  "use strict";

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  Drupal.behaviors.bootstrapSettingSummaries = {
    attach: function (context) {
      var $context = $(context);

      // General.
      $context.find('#edit-general').drupalSetSummary(function () {
        var summary = [];
        // Buttons.
        var size = $context.find('select[name="bootstrap_button_size"] :selected');
        if (size.val()) {
          summary.push(Drupal.t('@size Buttons', {
            '@size': size.text()
          }));
        }

        // Images.
        var shape = $context.find('select[name="bootstrap_image_shape"] :selected');
        if (shape.val()) {
          summary.push(Drupal.t('@shape Images', {
            '@shape': shape.text()
          }));
        }
        if ($context.find(':input[name="bootstrap_image_responsive"]').is(':checked')) {
          summary.push(Drupal.t('Responsive Images'));
        }

        // Tables.
        if ($context.find(':input[name="bootstrap_table_responsive"]').is(':checked')) {
          summary.push(Drupal.t('Responsive Tables'));
        }

        return summary.join(', ');

      });

      // Components.
      $context.find('#edit-components').drupalSetSummary(function () {
        var summary = [];
        // Breadcrumbs.
        var breadcrumb = parseInt($context.find('select[name="bootstrap_breadcrumb"]').val(), 10);
        if (breadcrumb) {
          summary.push(Drupal.t('Breadcrumbs'));
        }
        // Navbar.
        var navbar = 'Navbar: ' + $context.find('select[name="bootstrap_navbar_position"] :selected').text();
        if ($context.find('input[name="bootstrap_navbar_inverse"]').is(':checked')) {
          navbar += ' (' + Drupal.t('Inverse') + ')';
        }
        summary.push(navbar);
        return summary.join(', ');
      });

      // Javascript.
      $context.find('#edit-javascript').drupalSetSummary(function () {
        var summary = [];
        if ($context.find('input[name="bootstrap_anchors_fix"]').is(':checked')) {
          summary.push(Drupal.t('Anchors'));
        }
        if ($context.find('input[name="bootstrap_popover_enabled"]').is(':checked')) {
          summary.push(Drupal.t('Popovers'));
        }
        if ($context.find('input[name="bootstrap_tooltip_enabled"]').is(':checked')) {
          summary.push(Drupal.t('Tooltips'));
        }
        return summary.join(', ');
      });

      // Advanced.
      $context.find('#edit-advanced').drupalSetSummary(function () {
        var summary = [];
        var $cdnProvider = $context.find('select[name="bootstrap_cdn_provider"] :selected');
        var cdnProvider = $cdnProvider.val();
        if ($cdnProvider.length && cdnProvider.length) {
          summary.push(Drupal.t('CDN provider: %provider', { '%provider': $cdnProvider.text() }));

          // jsDelivr CDN.
          if (cdnProvider === 'jsdelivr') {
            var $jsDelivrVersion = $context.find('select[name="bootstrap_cdn_jsdelivr_version"] :selected');
            if ($jsDelivrVersion.length && $jsDelivrVersion.val().length) {
              summary.push($jsDelivrVersion.text());
            }
            var $jsDelivrTheme = $context.find('select[name="bootstrap_cdn_jsdelivr_theme"] :selected');
            if ($jsDelivrTheme.length && $jsDelivrTheme.val() !== 'bootstrap') {
              summary.push($jsDelivrTheme.text());
            }
          }
        }
        return summary.join(', ');
      });
    }
  };

  /**
   * Provide BootstrapCDN (via jsDelivr) theme preview.
   */
  Drupal.behaviors.bootstrapThemePreview = {
    attach: function (context) {
      var $context = $(context);
      var $preview = $context.find('#bootstrap-theme-preview');
      $preview.once('bootstrap-theme-preview', function () {
        // Construct the "Bootstrap Theme" preview here since it's not actually
        // a Bootswatch theme, but rather one provided by Bootstrap itself.
        // Unfortunately getbootstrap.com does not have HTTPS enabled, so the
        // preview image cannot be protocol relative.
        // @todo Make protocol relative if/when Bootstrap enables HTTPS.
        $preview.append('<a id="bootstrap-theme-preview-bootstrap_theme" class="bootswatch-preview element-invisible" href="http://getbootstrap.com/examples/theme/" target="_blank"><img class="img-responsive" src="http://getbootstrap.com/examples/screenshots/theme.jpg" alt="' + Drupal.t('Preview of the Bootstrap theme') + '" /></a>');

        // Retrieve the Bootswatch theme preview images.
        $.ajax({
          url: '//api.bootswatch.com/3/',
          dataType: 'json',
          success: function (json) {
            var themes = json.themes;
            for (var i = 0, len = themes.length; i < len; i++) {
              $preview.append('<a id="bootstrap-theme-preview-' + themes[i].name.toLowerCase() + '" class="bootswatch-preview element-invisible" href="' + themes[i].preview + '" target="_blank"><img class="img-responsive" src="' + themes[i].thumbnail.replace(/^http:/, 'https:') + '" alt="' + Drupal.t('Preview of the @title Bootswatch theme', { '@title': themes[i].name }) + '" /></a>');
            }
          },
          complete: function () {
            $preview.parent().find('select[name="bootstrap_cdn_jsdelivr_theme"]').bind('change', function () {
              $preview.find('.bootswatch-preview').addClass('element-invisible');
              if ($(this).val().length) {
                $preview.find('#bootstrap-theme-preview-' + $(this).val()).removeClass('element-invisible');
              }
            }).change();
          }
        });
      });
    }
  };

  /**
   * Provide Bootstrap navbar preview.
   */
  Drupal.behaviors.bootstrapNavbarPreview = {
    attach: function (context) {
      var $context = $(context);
      var $preview = $context.find('#edit-navbar');
      $preview.once('navbar', function () {
        var $body = $context.find('body');
        var $navbar = $context.find('#navbar.navbar');
        $preview.find('select[name="bootstrap_navbar_position"]').bind('change', function () {
          var $position = $(this).find(':selected').val();
          $navbar.removeClass('navbar-fixed-bottom navbar-fixed-top navbar-static-top container');
          if ($position.length) {
            $navbar.addClass('navbar-'+ $position);
          }
          else {
            $navbar.addClass('container');
          }
          // Apply appropriate classes to body.
          $body.removeClass('navbar-is-fixed-top navbar-is-fixed-bottom navbar-is-static-top');
          switch ($position) {
            case 'fixed-top':
              $body.addClass('navbar-is-fixed-top');
              break;

            case 'fixed-bottom':
              $body.addClass('navbar-is-fixed-bottom');
              break;

            case 'static-top':
              $body.addClass('navbar-is-static-top');
              break;
          }
        });
        $preview.find('input[name="bootstrap_navbar_inverse"]').bind('change', function () {
          $navbar.toggleClass('navbar-inverse navbar-default');
        });
      });
    }
  };

})(jQuery, Drupal);
;
