(function () {
  'use strict';

  document.querySelectorAll('[data-module="nhsw-code-viewer"]').forEach(function (viewer) {
    var tabs = viewer.querySelectorAll('.nhsw-code-viewer__tab');
    var panels = viewer.querySelectorAll('.nhsw-code-viewer__panel');
    var copyBtn = viewer.querySelector('.nhsw-code-viewer__copy');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('nhsw-code-viewer__tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) {
          p.classList.add('nhsw-code-viewer__panel--hidden');
        });

        tab.classList.add('nhsw-code-viewer__tab--active');
        tab.setAttribute('aria-selected', 'true');

        document.getElementById(tab.getAttribute('aria-controls'))
          .classList.remove('nhsw-code-viewer__panel--hidden');
      });
    });

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var activePanel = viewer.querySelector(
          '.nhsw-code-viewer__panel:not(.nhsw-code-viewer__panel--hidden)'
        );
        if (!activePanel) return;
        var code = activePanel.querySelector('code').textContent;

        if (navigator.clipboard) {
          navigator.clipboard.writeText(code).then(function () {
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('nhsw-code-viewer__copy--copied');
            setTimeout(function () {
              copyBtn.textContent = 'Copy code';
              copyBtn.classList.remove('nhsw-code-viewer__copy--copied');
            }, 2000);
          });
        } else {
          var el = document.createElement('textarea');
          el.value = code;
          el.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
          document.body.appendChild(el);
          el.select();
          try {
            document.execCommand('copy');
            copyBtn.textContent = 'Copied!';
            copyBtn.classList.add('nhsw-code-viewer__copy--copied');
            setTimeout(function () {
              copyBtn.textContent = 'Copy code';
              copyBtn.classList.remove('nhsw-code-viewer__copy--copied');
            }, 2000);
          } catch (err) {}
          document.body.removeChild(el);
        }
      });
    }
  });

    document.querySelectorAll('.nhsw-example-preview__footer-button[data-toggle]').forEach(function (toggleBtn) {
        toggleBtn.addEventListener('click', function () {
            var target = document.getElementById(toggleBtn.getAttribute('data-toggle'));
            if (!target) return;
            var expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
            toggleBtn.setAttribute('aria-expanded', String(!expanded));
            target.hidden = expanded;
        });
    });

    document.querySelectorAll('.nhsw-tabs').forEach(function (tabGroup) {
        var tabs = tabGroup.querySelectorAll('.nhsw-tabs__tab');
        var panels = tabGroup.querySelectorAll('.nhsw-tabs__panel');

        tabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                tabs.forEach(function (t) {
                    t.classList.remove('nhsw-tabs__tab--selected');
                    t.setAttribute('aria-selected', 'false');
                });
                panels.forEach(function (p) {
                    p.classList.add('nhsw-tabs__panel--hidden');
                });

                tab.classList.add('nhsw-tabs__tab--selected');
                tab.setAttribute('aria-selected', 'true');
                tabGroup.querySelector('#' + tab.getAttribute('aria-controls')).classList.remove('nhsw-tabs__panel--hidden');
            });
        });
    });
}());
