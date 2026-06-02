(function () {
  'use strict';

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // SVG icons — defined once and reused by _buildHTML
  var SVG_CALENDAR = '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M6 1a1 1 0 0 1 1 1v1h6V2a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h1V2a1 1 0 0 1 1-1zm7 3H7v1a1 1 0 0 1-2 0V4H4a1 1 0 0 0-1 1v2h14V5a1 1 0 0 0-1-1h-1v1a1 1 0 1 1-2 0V4zm2 5H5v6h10V9z"/></svg>';
  var SVG_PREV_YEAR  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><polyline points="11 17 6 12 11 7"></polyline><polyline points="18 17 13 12 18 7"></polyline></svg>';
  var SVG_PREV_MONTH = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  var SVG_NEXT_MONTH = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  var SVG_NEXT_YEAR  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg"><polyline points="13 17 18 12 13 7"></polyline><polyline points="6 17 11 12 6 7"></polyline></svg>';

  function NhswDatePicker(el) {
    this.el = el;

    // If the developer used the minimal hook pattern (no toggle button present),
    // build and inject all the chrome before querying element references.
    if (!el.querySelector('.nhsw-date-picker__toggle')) {
      this._buildHTML();
    }

    this.input = el.querySelector('.nhsw-date-picker__input');
    this.toggle = el.querySelector('.nhsw-date-picker__toggle');
    this.dialog = el.querySelector('.nhsw-date-picker__dialog');
    this.prevYearBtn = el.querySelector('.nhsw-date-picker__prev-year-button');
    this.prevBtn = el.querySelector('.nhsw-date-picker__prev-button');
    this.nextBtn = el.querySelector('.nhsw-date-picker__next-button');
    this.nextYearBtn = el.querySelector('.nhsw-date-picker__next-year-button');
    this.monthYearEl = el.querySelector('.nhsw-date-picker__month-year');
    this.calendarBody = el.querySelector('.nhsw-date-picker__calendar tbody');
    this.calendarTable = el.querySelector('.nhsw-date-picker__calendar');
    this.okBtn = el.querySelector('.nhsw-date-picker__ok-button');
    this.cancelBtn = el.querySelector('.nhsw-date-picker__cancel-button');

    this.isOpen = false;
    this.selectedDate = null;
    this.pendingDate = null;

    var today = new Date();
    this.viewYear = today.getFullYear();
    this.viewMonth = today.getMonth();

    this._bindEvents();
  }

  // Builds and injects the full date picker HTML from data-* attributes.
  // Only called when the developer uses the minimal hook pattern.
  NhswDatePicker.prototype._buildHTML = function () {
    var el = this.el;

    var inputId    = el.getAttribute('data-input-id') || ('nhsw-dp-' + Math.random().toString(36).slice(2, 7));
    var inputName  = el.getAttribute('data-input-name') || inputId;
    var value      = el.getAttribute('data-value') || '';
    var disabled   = el.hasAttribute('data-disabled');
    var describedBy = el.getAttribute('data-describedby') || '';

    // Derive the human-readable label text from the <label for="inputId"> in the page
    var labelEl = document.querySelector('label[for="' + inputId + '"]');
    var labelText = labelEl ? labelEl.textContent.trim() : 'date';

    var disabledAttr    = disabled    ? ' disabled'                          : '';
    var valueAttr       = value       ? ' value="' + value + '"'             : '';
    var describedByAttr = describedBy ? ' aria-describedby="' + describedBy + '"' : '';

    el.innerHTML =
      '<div class="nhsw-date-picker__input-group">' +
        '<input class="nhsw-input nhsw-date-picker__input"' +
          ' id="' + inputId + '"' +
          ' name="' + inputName + '"' +
          ' type="text"' +
          ' autocomplete="off"' +
          ' placeholder="DD-MMM-YYYY"' +
          describedByAttr + valueAttr + disabledAttr + '>' +
        '<button class="nhsw-date-picker__toggle" type="button"' +
          ' aria-label="Open calendar for ' + labelText + '"' +
          ' aria-expanded="false"' +
          ' aria-haspopup="dialog"' + disabledAttr + '>' +
          SVG_CALENDAR +
        '</button>' +
      '</div>' +
      '<div class="nhsw-date-picker__dialog" role="dialog" aria-modal="true"' +
          ' aria-label="Choose ' + labelText + '" hidden>' +
        '<div class="nhsw-date-picker__dialog-header">' +
          '<button class="nhsw-date-picker__nav-button nhsw-date-picker__prev-year-button" type="button" aria-label="Previous year">' + SVG_PREV_YEAR + '</button>' +
          '<button class="nhsw-date-picker__nav-button nhsw-date-picker__prev-button" type="button" aria-label="Previous month">' + SVG_PREV_MONTH + '</button>' +
          '<span class="nhsw-date-picker__month-year" aria-live="polite"></span>' +
          '<button class="nhsw-date-picker__nav-button nhsw-date-picker__next-button" type="button" aria-label="Next month">' + SVG_NEXT_MONTH + '</button>' +
          '<button class="nhsw-date-picker__nav-button nhsw-date-picker__next-year-button" type="button" aria-label="Next year">' + SVG_NEXT_YEAR + '</button>' +
        '</div>' +
        '<table class="nhsw-date-picker__calendar" role="grid">' +
          '<thead><tr>' +
            '<th scope="col" abbr="Monday">Mo</th>' +
            '<th scope="col" abbr="Tuesday">Tu</th>' +
            '<th scope="col" abbr="Wednesday">We</th>' +
            '<th scope="col" abbr="Thursday">Th</th>' +
            '<th scope="col" abbr="Friday">Fr</th>' +
            '<th scope="col" abbr="Saturday">Sa</th>' +
            '<th scope="col" abbr="Sunday">Su</th>' +
          '</tr></thead>' +
          '<tbody></tbody>' +
        '</table>' +
        '<div class="nhsw-date-picker__shortcuts">' +
          '<button type="button" class="nhsw-date-picker__shortcut" data-offset-days="0">Today</button>' +
          '<button type="button" class="nhsw-date-picker__shortcut" data-offset-days="7">+1 week</button>' +
          '<button type="button" class="nhsw-date-picker__shortcut" data-offset-days="14">+2 weeks</button>' +
          '<button type="button" class="nhsw-date-picker__shortcut" data-offset-days="28">+4 weeks</button>' +
          '<button type="button" class="nhsw-date-picker__shortcut" data-offset-months="1">+1 month</button>' +
        '</div>' +
        '<div class="nhsw-date-picker__dialog-footer">' +
          '<button class="nhsw-button nhsw-button--secondary nhsw-date-picker__cancel-button" type="button">Cancel</button>' +
          '<button class="nhsw-button nhsw-button--primary nhsw-date-picker__ok-button" type="button">OK</button>' +
        '</div>' +
      '</div>';
  };

  NhswDatePicker.prototype._bindEvents = function () {
    var self = this;

    this.toggle.addEventListener('click', function () {
      if (self.toggle.disabled) return;
      if (self.isOpen) { self._close(); } else { self._open(); }
    });

    this.prevYearBtn.addEventListener('click', function () { self._navigateYear(-1); });
    this.prevBtn.addEventListener('click', function () { self._navigateMonth(-1); });
    this.nextBtn.addEventListener('click', function () { self._navigateMonth(1); });
    this.nextYearBtn.addEventListener('click', function () { self._navigateYear(1); });

    this.okBtn.addEventListener('click', function () {
      if (self.pendingDate) { self._confirmDate(self.pendingDate); }
    });

    this.cancelBtn.addEventListener('click', function () { self._close(); });

    var shortcuts = this.el.querySelectorAll('.nhsw-date-picker__shortcut');
    shortcuts.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = new Date();
        var days = btn.getAttribute('data-offset-days');
        var months = btn.getAttribute('data-offset-months');
        if (days !== null) { target.setDate(target.getDate() + parseInt(days, 10)); }
        else if (months !== null) { target.setMonth(target.getMonth() + parseInt(months, 10)); }
        self.pendingDate = target;
        self.viewYear = target.getFullYear();
        self.viewMonth = target.getMonth();
        self._renderCalendar();
        self._focusDate(target);
      });
    });

    document.addEventListener('click', function (e) {
      if (self.isOpen && !self.el.contains(e.target)) { self._close(); }
    });

    this.dialog.addEventListener('keydown', function (e) { self._handleDialogKeydown(e); });
  };

  NhswDatePicker.prototype._open = function () {
    var parsed = this._parseInputValue(this.input.value);
    if (parsed) {
      this.selectedDate = parsed;
      this.pendingDate = new Date(parsed);
      this.viewYear = parsed.getFullYear();
      this.viewMonth = parsed.getMonth();
    } else {
      var today = new Date();
      this.pendingDate = new Date(today);
      this.viewYear = today.getFullYear();
      this.viewMonth = today.getMonth();
    }
    this._renderCalendar();
    this.dialog.removeAttribute('hidden');
    this.toggle.setAttribute('aria-expanded', 'true');
    this.isOpen = true;
    this._focusDate(this.pendingDate);
  };

  NhswDatePicker.prototype._close = function () {
    this.dialog.setAttribute('hidden', '');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.isOpen = false;
    this.toggle.focus();
  };

  NhswDatePicker.prototype._confirmDate = function (date) {
    this.selectedDate = new Date(date);
    this.input.value = this._formatDate(date);
    this.input.dispatchEvent(new Event('change', { bubbles: true }));
    this._close();
  };

  NhswDatePicker.prototype._formatDate = function (date) {
    var day = String(date.getDate()).padStart(2, '0');
    return day + '-' + SHORT_MONTHS[date.getMonth()] + '-' + date.getFullYear();
  };

  NhswDatePicker.prototype._parseInputValue = function (value) {
    if (!value) return null;
    var parts = value.split('-');
    if (parts.length !== 3) return null;
    var day = parseInt(parts[0], 10);
    var monthIndex = SHORT_MONTHS.indexOf(parts[1]);
    var year = parseInt(parts[2], 10);
    if (isNaN(day) || monthIndex === -1 || isNaN(year)) return null;
    var d = new Date(year, monthIndex, day);
    if (d.getFullYear() !== year || d.getMonth() !== monthIndex || d.getDate() !== day) return null;
    return d;
  };

  NhswDatePicker.prototype._isSameDay = function (a, b) {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  NhswDatePicker.prototype._navigateMonth = function (delta) {
    this.viewMonth += delta;
    if (this.viewMonth > 11) { this.viewMonth = 0; this.viewYear++; }
    else if (this.viewMonth < 0) { this.viewMonth = 11; this.viewYear--; }
    this._renderCalendar();
    var focus = (this.pendingDate && this.pendingDate.getFullYear() === this.viewYear && this.pendingDate.getMonth() === this.viewMonth)
      ? this.pendingDate
      : new Date(this.viewYear, this.viewMonth, 1);
    this._focusDate(focus);
  };

  NhswDatePicker.prototype._navigateYear = function (delta) {
    this.viewYear += delta;
    this._renderCalendar();
    var focus = (this.pendingDate && this.pendingDate.getFullYear() === this.viewYear && this.pendingDate.getMonth() === this.viewMonth)
      ? this.pendingDate
      : new Date(this.viewYear, this.viewMonth, 1);
    this._focusDate(focus);
  };

  NhswDatePicker.prototype._renderCalendar = function () {
    var year = this.viewYear;
    var month = this.viewMonth;
    var today = new Date();

    this.monthYearEl.textContent = MONTHS[month] + ' ' + year;
    this.calendarTable.setAttribute('aria-label', MONTHS[month] + ' ' + year);

    var firstDayOfWeek = (new Date(year, month, 1).getDay() + 6) % 7;
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var daysInPrevMonth = new Date(year, month, 0).getDate();
    var rows = Math.ceil((firstDayOfWeek + daysInMonth) / 7);

    var html = '';
    var currentDay = 1;
    var nextMonthDay = 1;

    for (var row = 0; row < rows; row++) {
      html += '<tr>';
      for (var col = 0; col < 7; col++) {
        var cellDate;
        var isOtherMonth;
        var cellIndex = row * 7 + col;

        if (cellIndex < firstDayOfWeek) {
          cellDate = new Date(year, month - 1, daysInPrevMonth - firstDayOfWeek + cellIndex + 1);
          isOtherMonth = true;
        } else if (currentDay > daysInMonth) {
          cellDate = new Date(year, month + 1, nextMonthDay++);
          isOtherMonth = true;
        } else {
          cellDate = new Date(year, month, currentDay++);
          isOtherMonth = false;
        }

        var isToday = this._isSameDay(cellDate, today);
        var isPending = this._isSameDay(cellDate, this.pendingDate);

        var classes = ['nhsw-date-picker__day'];
        if (isOtherMonth) classes.push('nhsw-date-picker__day--other-month');
        if (isToday && !isPending) classes.push('nhsw-date-picker__day--today');
        if (isPending) classes.push('nhsw-date-picker__day--pending');

        var ariaLabel = cellDate.getDate() + ' ' + MONTHS[cellDate.getMonth()] + ' ' + cellDate.getFullYear();
        var dataDate = cellDate.getFullYear() + '-' + String(cellDate.getMonth() + 1).padStart(2, '0') + '-' + String(cellDate.getDate()).padStart(2, '0');

        html += '<td>';
        html += '<button type="button"';
        html += ' class="' + classes.join(' ') + '"';
        html += ' tabindex="' + (isPending ? '0' : '-1') + '"';
        html += ' aria-label="' + ariaLabel + '"';
        html += ' aria-selected="' + (isPending ? 'true' : 'false') + '"';
        html += ' data-date="' + dataDate + '">';
        html += cellDate.getDate();
        html += '</button></td>';
      }
      html += '</tr>';
    }

    this.calendarBody.innerHTML = html;

    var self = this;
    this.calendarBody.querySelectorAll('.nhsw-date-picker__day').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var parts = btn.getAttribute('data-date').split('-');
        var clicked = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        self.pendingDate = clicked;
        self.calendarBody.querySelectorAll('.nhsw-date-picker__day').forEach(function (b) {
          var isThis = b === btn;
          b.classList.toggle('nhsw-date-picker__day--pending', isThis);
          b.classList.toggle('nhsw-date-picker__day--today', !isThis && self._isSameDay(
            new Date(
              parseInt(b.getAttribute('data-date').split('-')[0]),
              parseInt(b.getAttribute('data-date').split('-')[1]) - 1,
              parseInt(b.getAttribute('data-date').split('-')[2])
            ),
            new Date()
          ));
          b.setAttribute('aria-selected', isThis ? 'true' : 'false');
          b.setAttribute('tabindex', isThis ? '0' : '-1');
        });
        btn.focus();
      });
    });
  };

  NhswDatePicker.prototype._focusDate = function (date) {
    if (!date) return;

    if (date.getFullYear() !== this.viewYear || date.getMonth() !== this.viewMonth) {
      this.viewYear = date.getFullYear();
      this.viewMonth = date.getMonth();
      this._renderCalendar();
    }

    var dataDate = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
    var btn = this.calendarBody.querySelector('[data-date="' + dataDate + '"]');
    if (btn) {
      this.calendarBody.querySelectorAll('.nhsw-date-picker__day').forEach(function (b) { b.setAttribute('tabindex', '-1'); });
      btn.setAttribute('tabindex', '0');
      btn.focus();
    }
  };

  NhswDatePicker.prototype._handleDialogKeydown = function (e) {
    if (!this.isOpen) return;

    var activeIsDayBtn = document.activeElement && document.activeElement.classList.contains('nhsw-date-picker__day');
    var newDate;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this._close();
        break;

      case 'Enter':
        if (activeIsDayBtn && this.pendingDate) {
          e.preventDefault();
          this._confirmDate(this.pendingDate);
        }
        break;

      case 'ArrowLeft':
        if (activeIsDayBtn && this.pendingDate) {
          e.preventDefault();
          newDate = new Date(this.pendingDate);
          newDate.setDate(newDate.getDate() - 1);
          this.pendingDate = newDate;
          this._focusDate(newDate);
        }
        break;

      case 'ArrowRight':
        if (activeIsDayBtn && this.pendingDate) {
          e.preventDefault();
          newDate = new Date(this.pendingDate);
          newDate.setDate(newDate.getDate() + 1);
          this.pendingDate = newDate;
          this._focusDate(newDate);
        }
        break;

      case 'ArrowUp':
        if (activeIsDayBtn && this.pendingDate) {
          e.preventDefault();
          newDate = new Date(this.pendingDate);
          newDate.setDate(newDate.getDate() - 7);
          this.pendingDate = newDate;
          this._focusDate(newDate);
        }
        break;

      case 'ArrowDown':
        if (activeIsDayBtn && this.pendingDate) {
          e.preventDefault();
          newDate = new Date(this.pendingDate);
          newDate.setDate(newDate.getDate() + 7);
          this.pendingDate = newDate;
          this._focusDate(newDate);
        }
        break;

      case 'Home':
        if (activeIsDayBtn && this.pendingDate) {
          e.preventDefault();
          newDate = new Date(this.pendingDate);
          newDate.setDate(newDate.getDate() - ((newDate.getDay() + 6) % 7));
          this.pendingDate = newDate;
          this._focusDate(newDate);
        }
        break;

      case 'End':
        if (activeIsDayBtn && this.pendingDate) {
          e.preventDefault();
          newDate = new Date(this.pendingDate);
          var dow = (newDate.getDay() + 6) % 7;
          newDate.setDate(newDate.getDate() + (6 - dow));
          this.pendingDate = newDate;
          this._focusDate(newDate);
        }
        break;

      case 'PageUp':
        e.preventDefault();
        if (e.shiftKey) { this._navigateYear(-1); } else { this._navigateMonth(-1); }
        break;

      case 'PageDown':
        e.preventDefault();
        if (e.shiftKey) { this._navigateYear(1); } else { this._navigateMonth(1); }
        break;
    }
  };

  function initAll(scope) {
    var root = scope || document;
    root.querySelectorAll('[data-module="nhsw-date-picker"]').forEach(function (el) {
      new NhswDatePicker(el);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { initAll(); });
  } else {
    initAll();
  }

  if (typeof window !== 'undefined') {
    window.NhswDatePicker = NhswDatePicker;
    window.NhswDatePicker.initAll = initAll;
  }
})();
