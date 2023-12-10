function isPalindrome(num) {
  const strNum = num.toString();
  const reversed = strNum.split("").reverse().join("");
  return strNum === reversed;
}

function findPalindromes() {
  const startInput = document.getElementById("startRange");
  const endInput = document.getElementById("endRange");
  const start = parseInt(startInput.value);
  const end = parseInt(endInput.value);
  const resultDiv = document.getElementById("result");

  const maxResults = 1000;
  let palindromes = [];
  let count = 0;

  for (let i = start; i <= end; i++) {
    if (isPalindrome(i)) {
      palindromes.push(i);
      count++;
      if (count > maxResults) {
        break;
      }
    }
  }

  if (count > maxResults) {
    resultDiv.innerHTML = `<p>O intervalo é muito grande e pode causar travamentos. Por favor, escolha um intervalo menor.</p>`;
    return;
  }

  if (
    isNaN(start) ||
    isNaN(end) ||
    startInput.value === "" ||
    endInput.value === ""
  ) {
    resultDiv.innerHTML = "<p>Preencha ambos os campos.</p>";
    return;
  }

  if (start < 0 || end < 0) {
    resultDiv.innerHTML = "<p>Os números do intervalo devem ser positivos.</p>";
    return;
  }

  resultDiv.innerHTML = "<h3>Números Palíndromos Encontrados:</h3>";

  const ul = document.createElement("ul");
  palindromes.forEach((num) => {
    const li = document.createElement("li");
    li.textContent = num;
    ul.appendChild(li);
  });

  resultDiv.appendChild(ul);
}
