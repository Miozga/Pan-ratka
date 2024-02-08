function addExtraPaymentInput() {
  var container = document.getElementById('extraPaymentsInputs');
  var inputNumber = container.children.length / 2 + 1;
  var newDiv = document.createElement('div');

  newDiv.innerHTML = `
        <label>Numer raty:</label>
        <input type="number" id="paymentNo${inputNumber}" min="1" name="paymentNo">
        <label>Kwota nadpłaty:</label>
        <input type="number" id="extraAmount${inputNumber}" min="0" name="extraAmount">
    `;

  container.appendChild(newDiv);
}

function calculateLoan() {
  // Pobieranie danych kredytowych
  var amount = parseFloat(document.getElementById('loanAmount').value);
  var term = parseInt(document.getElementById('loanTerm').value) * 12; // w miesiącach
  var rate = parseFloat(document.getElementById('interestRate').value) / 100 / 12; // miesięczne

  // Pobieranie danych o nadpłatach
  var extraPayments = collectExtraPayments();

  // Generowanie harmonogramów
  generateAmortizationSchedule(amount, term, rate, 'originalAmortizationSchedule');
  generateAmortizationScheduleWithExtraPayments(
    amount,
    term,
    rate,
    extraPayments,
    'modifiedAmortizationSchedule'
  );
}
function generateAmortizationSchedule(amount, term, rate, scheduleId) {
  var scheduleContainer = document.getElementById(scheduleId);
  var table =
    '<table><thead><tr><th>Miesiąc</th><th>Rata</th><th>Odsetki</th><th>Kapitał</th><th>Pozostało do spłaty</th></tr></thead><tbody>';
  var remaining = amount;
  var totalInterest = 0;

  for (var i = 1; i <= term; i++) {
    var interest = remaining * rate;
    var monthlyPayment = (amount * rate) / (1 - Math.pow(1 + rate, -term));
    var capital = monthlyPayment - interest;
    remaining -= capital;
    totalInterest += interest;

    if (remaining < 0) {
      capital += remaining; // Ajust the last capital payment
      remaining = 0;
    }

    table += `<tr><td>${i}</td><td>${monthlyPayment.toFixed(2)}</td><td>${interest.toFixed(
      2
    )}</td><td>${capital.toFixed(2)}</td><td>${remaining.toFixed(2)}</td></tr>`;
  }

  table += '</tbody></table>';
  scheduleContainer.innerHTML = table;

  // Display total interest for the standard schedule
  document.getElementById('totalInterestStandard').innerText =
    'Całkowity koszt odsetek (standardowy): ' + totalInterest.toFixed(2) + ' zł';
}

function generateAmortizationScheduleWithExtraPayments(
  amount,
  term,
  rate,
  extraPayments,
  scheduleId
) {
  var scheduleContainer = document.getElementById(scheduleId);
  var table =
    '<table><thead><tr><th>Miesiąc</th><th>Rata</th><th>Odsetki</th><th>Kapitał</th><th>Pozostało do spłaty</th></tr></thead><tbody>';
  var remaining = amount;
  var totalInterestModified = 0;

  for (var i = 1; i <= term; i++) {
    var interest = remaining * rate;
    var extraPaymentAmount = extraPayments.find(ep => ep.paymentNo === i)?.extraAmount || 0;
    var capital = 0;

    remaining -= extraPaymentAmount; // Zmniejszenie kapitału o nadpłatę
    if (remaining <= 0) {
      remaining = 0;
      break; // Jeśli kredyt został spłacony, przerywamy pętlę
    }

    capital = (amount * rate) / (1 - Math.pow(1 + rate, -term)) - interest;
    remaining -= capital;
    totalInterestModified += interest;

    table += `<tr><td>${i}</td><td>${(capital + interest).toFixed(2)}</td><td>${interest.toFixed(
      2
    )}</td><td>${capital.toFixed(2)}</td><td>${remaining.toFixed(2)}</td></tr>`;
  }

  table += '</tbody></table>';
  scheduleContainer.innerHTML = table;

  // Zwracanie całkowitej sumy odsetek dla zmodyfikowanego harmonogramu
  return totalInterestModified;
}

function collectExtraPayments() {
  var extraPayments = [];
  var paymentNos = document.getElementsByName('paymentNo');
  var extraAmounts = document.getElementsByName('extraAmount');

  for (var i = 0; i < paymentNos.length; i++) {
    var paymentNo = parseInt(paymentNos[i].value);
    var extraAmount = parseFloat(extraAmounts[i].value);

    if (!isNaN(paymentNo) && !isNaN(extraAmount) && extraAmount > 0) {
      extraPayments.push({ paymentNo: paymentNo, extraAmount: extraAmount });
    }
  }
  return extraPayments;
}
