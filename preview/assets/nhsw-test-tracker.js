(function () {
  function init(scope) {
    var containers = scope.querySelectorAll('[data-module="nhsw-test-tracker"]');

    containers.forEach(function (container) {
      var storageKey = 'nhsw-test-tracker:' + (container.getAttribute('data-tracker-key') || location.pathname);
      // Exclude checkboxes nested inside a live example (e.g. a demo
      // checkbox/conditional-reveal shown under a checklist item) — only
      // the checklist's own items should count towards the total.
      var boxes = Array.prototype.filter.call(
        container.querySelectorAll('input[type="checkbox"]'),
        function (box) {
          return !box.closest('.nhsw-example-preview');
        }
      );
      var counter = container.querySelector('[data-tracker-count]');
      var resetBtn = container.querySelector('[data-tracker-reset]');

      function updateCount() {
        if (!counter) return;
        var checked = Array.prototype.filter.call(boxes, function (box) {
          return box.checked;
        }).length;
        counter.textContent = checked + ' of ' + boxes.length + ' checks complete';
      }

      function save() {
        var state = {};
        boxes.forEach(function (box) {
          if (box.checked) state[box.id] = true;
        });
        try {
          localStorage.setItem(storageKey, JSON.stringify(state));
        } catch (e) {
          /* localStorage unavailable (e.g. private browsing) — checklist still works, just won't persist */
        }
        updateCount();
      }

      function load() {
        var saved = {};
        try {
          saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
        } catch (e) {
          saved = {};
        }
        boxes.forEach(function (box) {
          box.checked = !!saved[box.id];
        });
        updateCount();
      }

      boxes.forEach(function (box) {
        box.addEventListener('change', save);
      });

      if (resetBtn) {
        resetBtn.addEventListener('click', function () {
          try {
            localStorage.removeItem(storageKey);
          } catch (e) {
            /* noop */
          }
          boxes.forEach(function (box) {
            box.checked = false;
          });
          updateCount();
        });
      }

      load();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      init(document);
    });
  } else {
    init(document);
  }
})();
