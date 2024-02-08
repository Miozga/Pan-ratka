function calculateLoan() {
  var amount = parseFloat(document.getElementById('loanAmount').value);
  var term = parseInt(document.getElementById('loanTerm').value) * 12; // w miesiącach
  var rate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // miesięczne
  var errorElement = document.getElementById('error');
  var rateType = document.querySelector('input[name="rateType"]:checked').value;

  errorElement.innerText = ''; // Reset błędów

  if (isNaN(amount) || isNaN(term) || isNaN(rate) || amount <= 0 || term <= 0 || rate <= 0) {
    errorElement.innerText = 'Proszę wprowadzić poprawne wartości.';
    return;
  }

  if (window.innerWidth >= 768) {
    generateAmortizationSchedule(amount, term, rate, 'equal');
    generateAmortizationSchedule(amount, term, rate, 'decreasing');
  } else {
    generateAmortizationSchedule(amount, term, rate, rateType);
  }
}

function generateAmortizationSchedule(amount, term, rate, type) {
  var scheduleContainer =
    type === 'equal'
      ? document.getElementById('equalAmortizationSchedule')
      : document.getElementById('decreasingAmortizationSchedule');

  scheduleContainer.innerHTML = ''; // Resetowanie harmonogramu

  var table =
    '<table><tr><th>Miesiąc</th><th>Rata</th><th>Odsetki</th><th>Kapitał</th><th>Pozostało do spłaty</th></tr>';
  var remaining = amount;

  for (var i = 1; i <= term; i++) {
    var interest = remaining * rate;
    var capital;
    var payment;

    if (type === 'equal') {
      payment = (amount * rate) / (1 - Math.pow(1 + rate, -term));
      capital = payment - interest;
    } else {
      capital = amount / term;
      payment = capital + interest;
    }

    remaining -= capital;

    table +=
      '<tr><td>' +
      i +
      '</td><td>' +
      payment.toFixed(2) +
      '</td><td>' +
      interest.toFixed(2) +
      '</td><td>' +
      capital.toFixed(2) +
      '</td><td>' +
      remaining.toFixed(2) +
      '</td></tr>';
  }

  table += '</table>';
  scheduleContainer.innerHTML = table;
}

window.onload = function () {
  // Ustawienie domyślnego widoku harmonogramu na mobilnych
  if (window.innerWidth < 768) {
    document.getElementById('decreasingAmortizationSchedule').style.display = 'none';
  }

  // Dodajemy nasłuchiwanie zmiany typu raty
  document.querySelectorAll('input[name="rateType"]').forEach(function (radio) {
    radio.onchange = function () {
      if (window.innerWidth < 768) {
        document.getElementById('equalAmortizationSchedule').style.display =
          this.value === 'equal' ? 'block' : 'none';
        document.getElementById('decreasingAmortizationSchedule').style.display =
          this.value === 'decreasing' ? 'block' : 'none';
      }
    };
  });
};
