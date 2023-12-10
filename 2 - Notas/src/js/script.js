function calculateChange() {
  const purchaseAmountInput = document.getElementById("purchaseAmount");
  const amountPaidInput = document.getElementById("amountPaid");
  const purchaseAmount = parseFloat(purchaseAmountInput.value);
  const amountPaid = parseFloat(amountPaidInput.value);
  const changeResult = document.getElementById("changeResult");

  const changeAmount = amountPaid - purchaseAmount;
  const maxValue = 1e9;

  let notes100 = Math.floor(changeAmount / 100);
  let remainingAfter100 = changeAmount % 100;

  let notes10 = Math.floor(remainingAfter100 / 10);
  let remainingAfter10 = remainingAfter100 % 10;

  let notes1 = Math.ceil(remainingAfter10);

  if (isNaN(purchaseAmount) || isNaN(amountPaid)) {
    changeResult.style.display = "none";
    alert("Preencha ambos os campos.");
    return;
  }

  if (purchaseAmount > maxValue || amountPaid > maxValue) {
    changeResult.style.display = "none";
    alert("O valor máximo permitido é 1 bilhão.");
    return;
  }

  if (purchaseAmount > amountPaid) {
    changeResult.style.display = "none";
    alert("O valor pago deve ser maior ou igual ao valor da compra.");
    return;
  }

  if (purchaseAmount < 0 || amountPaid < 0) {
    alert("Os números do intervalo devem ser positivos.");
    return;
  }

  document.getElementById("resultPurchaseAmount").textContent =
    purchaseAmount.toFixed(2);
  document.getElementById("changeAmount").textContent = changeAmount.toFixed(2);
  document.getElementById("notes100").textContent = notes100;
  document.getElementById("notes10").textContent = notes10;
  document.getElementById("notes1").textContent = notes1;

  changeResult.style.display = "block";
}
