
// change image path on Case Details
function changeImageSrc(anything) {
  $('.origin-img').attr('src',anything);
}

(function ($) {
  var MERCADO_JS = {
    init: function () {
      this.mercado_counter();
      this.mercado_clone_all_zan_menus();
      this.mercado_control_mobile_menu();
      this.mercado_control_panel();
      this.mercado_add_active_class();
    },

    // banner area number counter
    mercado_counter: function(){
      $('.counter').countUp({
        'time': 2000,
        'delay': 10
      });
    },

    mercado_add_active_class: function(){
      $('.thum > li').click(function (e) { 
        let _this = $(this);
        e.preventDefault();
        _this.siblings().removeClass('active');
        _this.addClass('active');
      });
    },
    /* ---------------------------------------------
		// Clone all Zan Menus for mobile
		---------------------------------------------*/
    mercado_clone_all_zan_menus: function () {
      var i = 0,
        panels_html_args = Array();
      $('.clone-main-menu').each(function () {
        var $this = $(this),
          thisMenu = $this,
          this_menu_id = thisMenu.attr('id'),
          this_menu_clone_id = 'mercado-clone-' + this_menu_id;
        if (!$('#' + this_menu_clone_id).length) {
          var thisClone = $this.clone(true); // Clone Wrap
          thisClone.find('.menu-item').addClass('clone-menu-item');
          thisClone.find('[id]').each(function () {
            // Change all tab links with href = this id
            thisClone.find('.vc_tta-panel-heading a[href="#' + $(this).attr('id') + '"]').attr('href', '#' + MERCADO_JS.mercado_add_string_prefix($(this).attr('id'), 'mercado-clone-'));
            $(this).attr('id', MERCADO_JS.mercado_add_string_prefix($(this).attr('id'), 'mercado-clone-'));
          });
          thisClone.find('.mercado-menu').addClass('mercado-menu-clone');
          var thisMenuId = 'mercado-panel-' + $this.attr('id'),
            thisMenuname = $this.data('menuname');
          // Create main panel if not exists
          if (!$('.mercado-clone-wrap .mercado-panels #mercado-main-panel').length) {
            $('.mercado-clone-wrap .mercado-panels').append('<div id="mercado-main-panel" class="mercado-panel mercado-main-panel"><ul class="depth-01"></ul></div>');
          }
          $('.mercado-clone-wrap .mercado-panels #mercado-main-panel ul').append('<li class="menu-item"><a data-target="#' + thisMenuId + '" class="mercado-next-panel" href="#' + thisMenuId + '"></a><a title="' + thisMenuname + '" class="mercado-item-title" href="#">' + thisMenuname + '</a></li>');

          if (!$('.mercado-clone-wrap .mercado-panels #mercado-panel-' + this_menu_id).length) {
            $('.mercado-clone-wrap .mercado-panels').append('<div id="mercado-panel-' + this_menu_id + '" class="mercado-panel mercado-hidden"><ul class="depth-01"></ul></div>');
          }
          var thisMainPanel = $('.mercado-clone-wrap .mercado-panels #mercado-panel-' + this_menu_id + ' ul');
          thisMainPanel.html(thisClone.html());
          MERCADO_JS.mercado_insert_children_panels_html_by_elem(thisMainPanel, i);
        }
      });
    },
    mercado_insert_children_panels_html_by_elem: function ($elem, i) {
      var index = parseInt(i, 10);
      if ($elem.find('.menu-item-has-children').length) {
        $elem.find('.menu-item-has-children').each(function () {
          var thisChildItem = $(this);
          MERCADO_JS.mercado_insert_children_panels_html_by_elem(thisChildItem, index);
          var next_nav_target = 'mercado-panel-' + String(index);
          // Make sure there is no duplicate panel id
          while ($('#' + next_nav_target).length) {
            index++;
            next_nav_target = 'mercado-panel-' + String(index);
          }
          // Insert Next Nav
          thisChildItem.prepend('<a class="mercado-next-panel" href="#' + next_nav_target + '" data-target="#' + next_nav_target + '"></a>');
          // Get sub menu html
          var submenu_html = $('<div>').append(thisChildItem.find('> .submenu,> .wrap-megamenu').clone()).html();
          thisChildItem.find('> .submenu,> .wrap-megamenu').remove();
          $('.mercado-clone-wrap .mercado-panels').append('<div id="' + next_nav_target + '" class="mercado-panel mercado-sub-panel mercado-hidden">' + submenu_html + '</div>');
        });
      }
    },
    mercado_control_panel: function () {
      $(document).on('click', '.mercado-next-panel', function (e) {
        var _this = $(this),
          thisItem = _this.closest('.menu-item'),
          thisPanel = _this.closest('.mercado-panel'),
          target_id = _this.attr('href');
        if ($(target_id).length) {
          thisPanel.addClass('mercado-sub-opened');
          $(target_id).addClass('mercado-panel-opened').removeClass('mercado-hidden').attr('data-parent-panel', thisPanel.attr('id'));
          typeof item_title == 'undefined'
          // Insert current panel title
          var item_title = '',
            firstItemTitle = '';

          item_title = _this.siblings(".mercado-item-title").attr('title');
          if (typeof item_title == 'undefined') {
            item_title = 'mercado menu';
          }

          if ($('.mercado-panels-actions-wrap .mercado-current-panel-title').length > 0) {
            firstItemTitle = $('.mercado-panels-actions-wrap .mercado-current-panel-title').html();
          }

          $('.mercado-panels-actions-wrap').find('.mercado-current-panel-title').remove();
          $('.mercado-panels-actions-wrap').prepend('<span class="mercado-current-panel-title">' + item_title + '</span>');

          // Back to previous panel
          $('.mercado-panels-actions-wrap .mercado-prev-panel').remove();
          $('.mercado-panels-actions-wrap').prepend('<a data-prenttitle="' + firstItemTitle + '" class="mercado-prev-panel" href="#' + thisPanel.attr('id') + '" data-cur-panel="' + target_id + '" data-target="#' + thisPanel.attr('id') + '"></a>');
        }
        e.preventDefault();
      });

      // Go to previous panel
      $(document).on('click', '.mercado-prev-panel', function (e) {
        var $this = $(this),
          cur_panel_id = $this.attr('data-cur-panel'),
          target_id = $this.attr('href');
        $(cur_panel_id).removeClass('mercado-panel-opened').addClass('mercado-hidden');
        $(target_id).addClass('mercado-panel-opened').removeClass('mercado-sub-opened');

        // Set new back button
        var new_parent_panel_id = $(target_id).attr('data-parent-panel');
        if (typeof new_parent_panel_id == 'undefined' || typeof new_parent_panel_id == false) {
          $('.mercado-panels-actions-wrap .mercado-prev-panel').remove();
          $('.mercado-panels-actions-wrap .mercado-current-panel-title').remove();
        } else {
          $('.mercado-panels-actions-wrap .mercado-prev-panel').attr('href', '#' + new_parent_panel_id).attr('data-cur-panel', target_id).attr('data-target', '#' + new_parent_panel_id);
          // Insert new panel title
          var item_title = '';
          item_title = $('#' + new_parent_panel_id).find('.mercado-next-panel[data-target="' + target_id + '"]').siblings('.mercado-item-title').attr('title');
          if (typeof item_title == 'undefined') {
            item_title = 'mercado menu';
          }
          $('.mercado-panels-actions-wrap').prepend('<span class="mercado-current-panel-title">' + item_title + '</span>');
        }
        e.preventDefault();
      });

    },
    mercado_control_mobile_menu: function () {
      // BOX MOBILE MENU
      $(document).on('click', '.mobile-navigation', function (el) {
        el.preventDefault();
        $('.mercado-clone-wrap').addClass('open');
        return false;
      });
      // Close box menu
      $(document).on('click', '.mercado-clone-wrap .mercado-close-panels', function () {
        $('.mercado-clone-wrap').removeClass('open');
        return false;
      });
    },
  }
  /* ---------------------------------------------
	 Scripts on load
	 --------------------------------------------- */
  window.onload = function () {
    MERCADO_JS.init();
  }

})(window.Zepto || window.jQuery, window, document);