(function () {
  'use strict';

  document.querySelectorAll('[data-max-length]').forEach(function (field) {
    var maxLength = parseInt(field.getAttribute('data-max-length'), 10);
    var counter = document.getElementById(field.getAttribute('data-max-length-target'));
    if (!counter) return;

    function update() {
      var remaining = maxLength - field.value.length;
      counter.textContent = 'You have ' + remaining + ' character' + (remaining === 1 ? '' : 's') + ' remaining';
    }

    field.addEventListener('input', update);
    update();
  });

  document.querySelectorAll('[data-aria-controls]').forEach(function (input) {
    var target = document.getElementById(input.getAttribute('data-aria-controls'));
    if (!target) return;
    input.setAttribute('aria-controls', input.getAttribute('data-aria-controls'));
    input.setAttribute('aria-expanded', String(input.checked));
    target.classList.toggle('nhsw-checkboxes__conditional--hidden', !input.checked);

    input.addEventListener('change', function () {
      input.setAttribute('aria-expanded', String(input.checked));
      target.classList.toggle('nhsw-checkboxes__conditional--hidden', !input.checked);
    });
  });

  document.querySelectorAll('[data-checkbox-exclusive]').forEach(function (exclusive) {
    var group = document.querySelectorAll('input[name="' + exclusive.name + '"]');
    exclusive.addEventListener('change', function () {
      if (exclusive.checked) {
        group.forEach(function (input) {
          if (input !== exclusive) input.checked = false;
        });
      }
    });
    group.forEach(function (input) {
      if (input === exclusive) return;
      input.addEventListener('change', function () {
        if (input.checked) exclusive.checked = false;
      });
    });
  });

  function formatRemaining(totalSeconds) {
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = totalSeconds % 60;
    var minutePart = minutes > 0 ? minutes + ' minute' + (minutes === 1 ? '' : 's') : '';
    var secondPart = seconds + ' second' + (seconds === 1 ? '' : 's');
    return minutePart ? minutePart + ' and ' + secondPart : secondPart;
  }

  document.querySelectorAll('[data-nhsw-timeout-countdown]').forEach(function (countdown) {
    var modal = countdown.closest('.nhsw-timeout-modal');
    var liveRegion = modal ? modal.querySelector('[data-nhsw-timeout-live]') : null;
    var remaining = parseInt(countdown.getAttribute('data-seconds'), 10);
    var tick = 0;

    var interval = setInterval(function () {
      remaining -= 1;
      tick += 1;
      if (remaining <= 0) {
        clearInterval(interval);
        return;
      }
      countdown.textContent = formatRemaining(remaining);
      if (liveRegion && tick % 15 === 0) {
        liveRegion.textContent = formatRemaining(remaining) + ' remaining';
      }
    }, 1000);

    var dismissButton = modal ? modal.querySelector('[data-nhsw-timeout-dismiss]') : null;
    if (dismissButton) {
      dismissButton.addEventListener('click', function () {
        clearInterval(interval);
        if (typeof modal.close === 'function') {
          modal.close();
        } else {
          modal.removeAttribute('open');
        }
      });
    }
  });

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

    document.querySelectorAll('.nhsw-expander__button').forEach(function (button) {
        button.addEventListener('click', function () {
            var target = document.getElementById(button.getAttribute('aria-controls'));
            if (!target) return;
            var expanded = button.getAttribute('aria-expanded') === 'true';
            button.setAttribute('aria-expanded', String(!expanded));
            target.hidden = expanded;
        });
    });

    document.querySelectorAll('.nhsw-file-upload__input').forEach(function (input) {
        var container = input.closest('.nhsw-file-upload');
        var status = container && container.querySelector('.nhsw-file-upload__status');
        if (!container || !status) return;
        var emptyText = status.textContent;

        input.addEventListener('change', function () {
            var hasFile = input.files && input.files.length > 0;
            status.textContent = hasFile ? input.files[0].name : emptyText;
            status.classList.toggle('nhsw-file-upload__status--filled', hasFile);
            container.classList.toggle('nhsw-file-upload--has-file', hasFile);
        });
    });

    document.querySelectorAll('.nhsw-tabs').forEach(function (tabGroup) {
        // Scoped to direct children so a demo `.nhsw-tabs` nested inside a panel
        // (e.g. on the Tabs component doc page) doesn't get wired up twice.
        var tabs = tabGroup.querySelectorAll(':scope > .nhsw-tabs__list .nhsw-tabs__tab');
        var panels = tabGroup.querySelectorAll(':scope > .nhsw-tabs__panel');

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

            tab.addEventListener('keydown', function (event) {
                var currentIndex = Array.prototype.indexOf.call(tabs, tab);
                var newIndex;
                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    newIndex = (currentIndex + 1) % tabs.length;
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                } else {
                    return;
                }
                event.preventDefault();
                tabs[newIndex].focus();
                tabs[newIndex].click();
            });
        });
    });
}());
