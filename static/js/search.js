(function () {
  var form = document.querySelector(".search");
  if (!form) return;
  var input = form.querySelector(".search-input");
  var list = form.querySelector(".search-results");
  var index = null, loading = null, active = -1, timer;

  function load() {
    if (index) return Promise.resolve(index);
    if (!loading) {
      loading = fetch(form.dataset.index)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          index = data.map(function (p) {
            return { p: p, title: p.t.toLowerCase(), tags: p.g.toLowerCase(), body: p.c.toLowerCase() };
          });
          return index;
        });
    }
    return loading;
  }

  function esc(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function snippet(text, term) {
    var i = text.toLowerCase().indexOf(term);
    if (i < 0) return "";
    var start = Math.max(0, i - 40);
    return (start > 0 ? "…" : "") + text.slice(start, i + term.length + 60).replace(/\s+/g, " ") + "…";
  }

  function search(q) {
    var terms = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    var hits = [];
    index.forEach(function (e) {
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        var t = terms[i], s = 0;
        if (e.title.indexOf(t) >= 0) s += 10;
        if (e.tags.indexOf(t) >= 0) s += 5;
        if (e.body.indexOf(t) >= 0) s += 1;
        if (!s) return;
        score += s;
      }
      hits.push({ e: e, score: score });
    });
    hits.sort(function (a, b) { return b.score - a.score || (a.e.p.d < b.e.p.d ? 1 : -1); });
    return hits.slice(0, 8).map(function (h) { return h.e.p; });
  }

  function close() {
    list.hidden = true;
    input.setAttribute("aria-expanded", "false");
    active = -1;
  }

  function render(q) {
    var res = search(q);
    var first = q.toLowerCase().split(/\s+/).filter(Boolean)[0] || "";
    if (!res.length) {
      list.innerHTML = '<li class="search-empty">no matches for "' + esc(q) + '"</li>';
    } else {
      list.innerHTML = res.map(function (p, i) {
        return '<li role="option" id="sr-' + i + '"><a href="' + esc(p.u) + '"><span class="sr-title">' + esc(p.t) +
          '</span><span class="sr-meta">' + p.d + '</span><span class="sr-snip">' + esc(snippet(p.c, first)) + "</span></a></li>";
      }).join("");
    }
    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    active = -1;
  }

  function highlight(n) {
    var items = list.querySelectorAll("li[role=option]");
    if (!items.length) return;
    active = (n + items.length) % items.length;
    items.forEach(function (li, i) { li.classList.toggle("active", i === active); });
    input.setAttribute("aria-activedescendant", items[active].id);
  }

  input.addEventListener("focus", load);
  input.addEventListener("input", function () {
    clearTimeout(timer);
    var q = input.value.trim();
    if (!q) return close();
    timer = setTimeout(function () { load().then(function () { render(q); }); }, 120);
  });
  input.addEventListener("keydown", function (ev) {
    if (ev.key === "ArrowDown") { ev.preventDefault(); highlight(active + 1); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); highlight(active - 1); }
    else if (ev.key === "Escape") { close(); }
  });
  form.addEventListener("submit", function (ev) {
    if (!index) return;
    ev.preventDefault();
    var links = list.querySelectorAll("li[role=option] a");
    var pick = links[active >= 0 ? active : 0];
    if (pick) location.href = pick.href;
  });
  document.addEventListener("click", function (ev) {
    if (!form.contains(ev.target)) close();
  });
})();
