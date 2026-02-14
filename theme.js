/**
 * Theme toggle — blocks in <head> to prevent flash of wrong theme.
 *
 * Priority: localStorage > system preference > light
 * Sets data-theme on <html> before first paint.
 */
(function () {
  var stored = localStorage.getItem('uistate-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored || 'dark';
  document.documentElement.setAttribute('data-theme', theme);

  // Listen for system preference changes (only if user hasn't explicitly chosen)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
    if (!localStorage.getItem('uistate-theme')) {
      var t = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', t);
      updateToggleIcon(t);
    }
  });

  // Toggle function — called by the button after DOM is ready
  window.__toggleTheme = function () {
    // Enable transitions only on intentional toggle
    document.documentElement.classList.add('theme-transitioning');
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('uistate-theme', next);
    updateToggleIcon(next);
    // Remove transition class after animation completes
    setTimeout(function () {
      document.documentElement.classList.remove('theme-transitioning');
    }, 300);
  };

  function updateToggleIcon(t) {
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.textContent = t === 'dark' ? '☀' : '☾';
    }
  }

  // Set icon once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { updateToggleIcon(theme); });
  } else {
    updateToggleIcon(theme);
  }
})();