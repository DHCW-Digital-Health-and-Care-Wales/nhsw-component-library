(function () {
  'use strict';

  document.querySelectorAll('[data-max-length]').forEach(function (field) {
    var maxLength = parseInt(field.getAttribute('data-max-length'), 10);
    var counter = document.getElementById(field.getAttribute('data-max-length-target'));
    if (!counter) return;

    function update() {
      var remaining = maxLength - field.value.length;
      var over = remaining < 0;
      counter.classList.toggle('nhsw-textarea__count--error', over);
      if (over) {
        var overBy = Math.abs(remaining);
        counter.textContent = 'You have ' + overBy + ' character' + (overBy === 1 ? '' : 's') + ' too many';
      } else {
        counter.textContent = 'You have ' + remaining + ' character' + (remaining === 1 ? '' : 's') + ' remaining';
      }
    }

    field.addEventListener('input', update);
    update();
  });

  document.querySelectorAll('[data-aria-controls]').forEach(function (input) {
    var target = document.getElementById(input.getAttribute('data-aria-controls'));
    if (!target) return;
    // aria-expanded is deliberately not set here: it isn't a valid ARIA
    // attribute on the checkbox/radio role, and axe-core flags it as a
    // critical violation. aria-controls (a global attribute) is enough.
    input.setAttribute('aria-controls', input.getAttribute('data-aria-controls'));
    target.classList.toggle('nhsw-checkboxes__conditional--hidden', !input.checked);

    input.addEventListener('change', function () {
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
