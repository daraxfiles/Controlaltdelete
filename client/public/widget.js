/**
 * CTRL+ALT+MEDIA — Embeddable Media Patch Widget
 *
 * Usage:
 *   <div data-ctrl-patch="PATCH_ID"></div>
 *   <script src="https://your-domain/widget.js" async></script>
 *
 * The script finds every [data-ctrl-patch] element on the page,
 * fetches the patch data, and renders a terminal-styled card.
 */
(function () {
  "use strict";

  // Capture the script element's own src at parse time via document.currentScript,
  // before any deferred scripts can shift the last-script assumption.
  var BASE_URL = (function () {
    var el = document.currentScript;
    var src = (el && el.src) ? el.src : "";
    if (!src) {
      // Fallback: scan for the widget.js script tag by URL pattern
      var scripts = document.getElementsByTagName("script");
      for (var i = scripts.length - 1; i >= 0; i--) {
        if (/\/widget\.js/.test(scripts[i].src)) { src = scripts[i].src; break; }
      }
    }
    return src.replace(/\/widget\.js.*$/, "");
  })();

  var COLORS = {
    bg: "#0a0a0a",
    card: "#111111",
    border: "#1f1f1f",
    primary: "#22c55e",
    muted: "#6b7280",
    text: "#e5e7eb",
    accent: "#06b6d4",
    error: "#ef4444",
    amber: "#f59e0b",
  };

  function statusColor(status) {
    if (status === "verified") return COLORS.primary;
    if (status === "disputed") return COLORS.error;
    return COLORS.amber;
  }

  function statusLabel(status) {
    if (status === "verified") return "✓ VERIFIED";
    if (status === "disputed") return "⚠ DISPUTED";
    return "◎ PENDING";
  }

  function formatDate(iso) {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (_) { return ""; }
  }

  function renderCard(el, patch) {
    var patchUrl = BASE_URL + "/reboot-room";
    var color = statusColor(patch.verificationStatus);
    var label = statusLabel(patch.verificationStatus);

    el.innerHTML = [
      '<div style="',
        'font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;',
        'background:', COLORS.card, ';',
        'border:1px solid ', COLORS.border, ';',
        'border-top:2px solid ', color, ';',
        'border-radius:4px;',
        'padding:16px 20px;',
        'max-width:480px;',
        'box-sizing:border-box;',
        'color:', COLORS.text, ';',
      '">',

        // Header bar
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">',
          '<span style="font-size:9px;letter-spacing:.12em;color:', COLORS.muted, ';text-transform:uppercase;">',
            'CTRL+ALT+MEDIA',
          '</span>',
          '<span style="',
            'font-size:9px;letter-spacing:.1em;font-weight:700;',
            'color:', color, ';',
            'padding:2px 7px;',
            'border:1px solid ', color, '44;',
            'border-radius:2px;',
            'background:', color, '14;',
          '">',
            label,
          '</span>',
        '</div>',

        // Title
        '<div style="font-size:15px;font-weight:900;line-height:1.3;color:', COLORS.text, ';margin-bottom:6px;">',
          escapeHtml(patch.title),
        '</div>',

        // Meta row
        '<div style="font-size:11px;color:', COLORS.muted, ';margin-bottom:10px;display:flex;flex-wrap:wrap;gap:8px;">',
          '<span>👥 ', escapeHtml(patch.crewName), '</span>',
          '<span>📍 ', escapeHtml(patch.community), '</span>',
          patch.mediaType ? '<span>🎞 ' + escapeHtml(patch.mediaType) + '</span>' : '',
        '</div>',

        // Summary (if present)
        patch.description ? [
          '<div style="',
            'font-size:12px;line-height:1.6;',
            'color:', COLORS.muted, ';',
            'border-left:2px solid ', COLORS.border, ';',
            'padding-left:10px;',
            'margin-bottom:12px;',
            'display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;',
          '">',
            escapeHtml(patch.description),
          '</div>',
        ].join('') : '',

        // Footer
        '<div style="display:flex;align-items:center;justify-content:space-between;border-top:1px solid ', COLORS.border, ';padding-top:10px;margin-top:4px;">',
          '<span style="font-size:10px;color:', COLORS.border.replace('1f','4b'), ';">',
            patch.publishedAt ? formatDate(patch.publishedAt) : '',
          '</span>',
          '<a href="', patchUrl, '" target="_blank" rel="noopener noreferrer" style="',
            'font-size:11px;font-weight:700;letter-spacing:.05em;',
            'color:', COLORS.primary, ';',
            'text-decoration:none;',
            'padding:5px 12px;',
            'border:1px solid ', COLORS.primary, '55;',
            'border-radius:2px;',
            'background:', COLORS.primary, '0d;',
          '">',
            'Read on CTRL+ALT+MEDIA →',
          '</a>',
        '</div>',

      '</div>',
    ].join('');
  }

  function renderError(el, message) {
    el.innerHTML = [
      '<div style="',
        'font-family:ui-monospace,monospace;',
        'background:', COLORS.card, ';',
        'border:1px solid ', COLORS.error, '44;',
        'border-radius:4px;padding:12px 16px;',
        'color:', COLORS.error, ';font-size:12px;max-width:480px;',
      '">',
        '⚠ CTRL+ALT+MEDIA widget: ', escapeHtml(message),
      '</div>',
    ].join('');
  }

  function renderLoading(el) {
    el.innerHTML = [
      '<div style="',
        'font-family:ui-monospace,monospace;',
        'background:', COLORS.card, ';',
        'border:1px solid ', COLORS.border, ';',
        'border-radius:4px;padding:16px 20px;max-width:480px;',
        'color:', COLORS.muted, ';font-size:11px;letter-spacing:.08em;',
      '">',
        'LOADING PATCH DATA…',
      '</div>',
    ].join('');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadWidget(el) {
    var patchId = el.getAttribute('data-ctrl-patch');
    if (!patchId) { renderError(el, 'Missing data-ctrl-patch attribute.'); return; }
    renderLoading(el);
    fetch(BASE_URL + '/api/widget/' + encodeURIComponent(patchId))
      .then(function (r) { return r.ok ? r.json() : Promise.reject('HTTP ' + r.status); })
      .then(function (patch) { renderCard(el, patch); })
      .catch(function (err) { renderError(el, 'Could not load patch (' + err + ').'); });
  }

  function init() {
    var els = document.querySelectorAll('[data-ctrl-patch]');
    for (var i = 0; i < els.length; i++) { loadWidget(els[i]); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
