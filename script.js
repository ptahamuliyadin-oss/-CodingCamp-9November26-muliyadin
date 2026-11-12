(function () {
  'use strict';

  // ---- Config (change currency here) ----
  var STORAGE_KEY = 'expense-visualizer.transactions';
  var LOCALE = 'id-ID';
  var CURRENCY = 'IDR';
  var CATEGORIES = {
    Food: '#e0a030',
    Transport: '#2f7a9a',
    Fun: '#c45a7a'
  };

  var money = new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: CURRENCY,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  // ---- Elements ----
  var form = document.getElementById('expense-form');
  var nameInput = document.getElementById('item-name');
  var amountInput = document.getElementById('item-amount');
  var categoryInput = document.getElementById('item-category');
  var balanceEl = document.getElementById('balance');
  var listEl = document.getElementById('tx-list');
  var listEmpty = document.getElementById('list-empty');
  var canvas = document.getElementById('spending-chart');
  var chartEmpty = document.getElementById('chart-empty');

  var fields = [
    { input: nameInput, error: document.getElementById('name-error') },
    { input: amountInput, error: document.getElementById('amount-error') },
    { input: categoryInput, error: document.getElementById('category-error') }
  ];

  var transactions = load();
  var chart = null;

  // ---- Storage ----
  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(data)) return [];
      return data.filter(function (t) {
        return t && typeof t.name === 'string' &&
          typeof t.amount === 'number' && isFinite(t.amount) &&
          Object.prototype.hasOwnProperty.call(CATEGORIES, t.category);
      });
    } catch (e) {
      return [];
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    } catch (e) {
      // Storage may be full or blocked; the app keeps working in memory.
    }
  }

  // ---- Validation ----
  function setError(field, message) {
    field.error.textContent = message;
    field.input.classList.toggle('invalid', Boolean(message));
  }

  function clearErrors() {
    fields.forEach(function (f) { setError(f, ''); });
  }

  function validate() {
    var ok = true;
    var name = nameInput.value.trim();
    var amount = parseFloat(amountInput.value);

    if (!name) {
      setError(fields[0], 'Enter an item name.');
      ok = false;
    } else {
      setError(fields[0], '');
    }

    if (amountInput.value.trim() === '') {
      setError(fields[1], 'Enter an amount.');
      ok = false;
    } else if (!isFinite(amount) || amount <= 0) {
      setError(fields[1], 'Amount must be a number greater than 0.');
      ok = false;
    } else {
      setError(fields[1], '');
    }

    if (!categoryInput.value) {
      setError(fields[2], 'Choose a category.');
      ok = false;
    } else {
      setError(fields[2], '');
    }

    return ok;
  }

  // ---- Rendering ----
  function renderBalance() {
    var total = transactions.reduce(function (sum, t) { return sum + t.amount; }, 0);
    balanceEl.textContent = money.format(total);
  }

  function renderList() {
    listEl.textContent = '';
    listEmpty.hidden = transactions.length > 0;
    listEl.hidden = transactions.length === 0;

    // Newest first
    transactions.slice().reverse().forEach(function (t) {
      var li = document.createElement('li');
      li.className = 'tx-item';

      var dot = document.createElement('span');
      dot.className = 'dot';
      dot.style.background = CATEGORIES[t.category];

      var info = document.createElement('div');
      var name = document.createElement('span');
      name.className = 'tx-name';
      name.textContent = t.name;
      var cat = document.createElement('span');
      cat.className = 'tx-cat';
      cat.textContent = t.category;
      info.appendChild(name);
      info.appendChild(cat);

      var amount = document.createElement('span');
      amount.className = 'tx-amount';
      amount.textContent = money.format(t.amount);

      var del = document.createElement('button');
      del.type = 'button';
      del.className = 'btn-delete';
      del.textContent = '\u00d7';
      del.setAttribute('aria-label', 'Delete ' + t.name);
      del.dataset.id = t.id;

      li.appendChild(dot);
      li.appendChild(info);
      li.appendChild(amount);
      li.appendChild(del);
      listEl.appendChild(li);
    });
  }

  function totalsByCategory() {
    var totals = {};
    Object.keys(CATEGORIES).forEach(function (c) { totals[c] = 0; });
    transactions.forEach(function (t) { totals[t.category] += t.amount; });
    return totals;
  }

  function renderChart() {
    var hasData = transactions.length > 0;
    chartEmpty.hidden = hasData;
    canvas.hidden = !hasData;

    if (typeof Chart === 'undefined') {
      chartEmpty.hidden = false;
      chartEmpty.textContent = 'The chart library could not be loaded. Check your internet connection and reload.';
      canvas.hidden = true;
      return;
    }

    if (!hasData) return;

    var totals = totalsByCategory();
    var labels = Object.keys(CATEGORIES);
    var values = labels.map(function (l) { return totals[l]; });
    var colors = labels.map(function (l) { return CATEGORIES[l]; });

    if (!chart) {
      chart = new Chart(canvas, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{ data: values, backgroundColor: colors, borderColor: '#ffffff', borderWidth: 2 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { position: 'bottom' },
            tooltip: {
              callbacks: {
                label: function (ctx) {
                  var sum = ctx.dataset.data.reduce(function (a, b) { return a + b; }, 0);
                  var pct = sum ? Math.round((ctx.parsed / sum) * 100) : 0;
                  return ' ' + ctx.label + ': ' + money.format(ctx.parsed) + ' (' + pct + '%)';
                }
              }
            }
          }
        }
      });
    } else {
      chart.data.datasets[0].data = values;
      chart.update();
    }
  }

  function render() {
    renderBalance();
    renderList();
    renderChart();
  }

  // ---- Events ----
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;

    transactions.push({
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      name: nameInput.value.trim(),
      amount: parseFloat(amountInput.value),
      category: categoryInput.value
    });
    save();
    render();

    form.reset();
    clearErrors();
    nameInput.focus();
  });

  fields.forEach(function (f) {
    f.input.addEventListener('input', function () { setError(f, ''); });
  });

  listEl.addEventListener('click', function (e) {
    var btn = e.target.closest('.btn-delete');
    if (!btn) return;
    transactions = transactions.filter(function (t) { return t.id !== btn.dataset.id; });
    save();
    render();
  });

  render();
})();
