const resultadoDiv = document.getElementById("resultado");
const localStorageKey = "cepsSalvos";

let map;
let cepsArray = [];
let markers = [];
let consultandoCEP = false;

function validarCEPFormato(cep) {
  const regexCEP = /^[0-9]{5}-?[0-9]{3}$/;
  return regexCEP.test(cep);
}

function adicionarCEP() {
  const cepInput = document.getElementById("cepInput");
  const cep = cepInput.value.trim();

  if (cep !== "" && cepsArray.length < 5) {
    if (validarCEPFormato(cep)) {
      if (!cepsArray.includes(cep)) {
        cepsArray.push(cep);
        localStorage.setItem(localStorageKey, JSON.stringify(cepsArray));
        cepInput.value = "";
        exibirCEPsAdicionados();
        console.log("CEP adicionado:", cepsArray);
        consultarCEPs();
      } else {
        alert("Este CEP já foi adicionado.");
      }
    } else {
      alert("Por favor, insira um CEP válido.");
    }
  } else if (cepsArray.length >= 5) {
    alert("Você já adicionou o número máximo de CEPs para consulta.");
  } else {
    alert("Por favor, insira um CEP válido.");
  }
}

function removerCEP(index) {
  if (index >= 0 && index < cepsArray.length) {
    removerMarcador(index);
    cepsArray.splice(index, 1);
    exibirCEPsAdicionados();
    resultadoDiv.innerHTML = "";
    localStorage.setItem(localStorageKey, JSON.stringify(cepsArray));
    location.reload();

    if (cepsArray.length === 0) {
      localStorage.removeItem(localStorageKey);
    }
  }
}

function removerMarcador(index) {
  if (index >= 0 && index < cepsArray.length) {
    if (markers[index]) {
      markers[index].setMap(null);
      markers.splice(index, 1);
      ajustarZoom();

      markers.forEach((marker) => {
        marker.setMap(map);
      });
    }
  }
}

function exibirCEPsAdicionados() {
  const cepsAdicionadosDiv = document.getElementById("cepsAdicionados");
  cepsAdicionadosDiv.innerHTML = "";

  cepsArray.forEach((cep, index) => {
    const cepItem = document.createElement("div");
    cepItem.innerHTML = `
      <span>${cep}</span>
      <button class="remove-button" onclick="removerCEP(${index})"><i class="fas fa-times"></i></button>
    `;
    cepsAdicionadosDiv.appendChild(cepItem);
  });
}

function getSavedCEPs() {
  const savedCEPs = localStorage.getItem(localStorageKey);
  return savedCEPs ? JSON.parse(savedCEPs) : [];
}

window.addEventListener("DOMContentLoaded", () => {
  cepsArray = getSavedCEPs();
  exibirCEPsAdicionados();
  consultarCEPs();
});

async function consultarCEPs() {
  if (cepsArray.length === 0) {
    return;
  }
  resultadoDiv.innerHTML = "";

  for (const cep of cepsArray) {
    await consultarCEP(cep);
  }
}

function obterCoordenadas(data) {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    const address = `${data.logradouro}, ${data.localidade}, ${data.uf}, Brazil`;

    geocoder.geocode({ address: address }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const latitude = results[0].geometry.location.lat();
        const longitude = results[0].geometry.location.lng();
        data.latitude = latitude;
        data.longitude = longitude;
        resolve();
      } else {
        reject("Geocodificação falhou devido a: " + status);
      }
    });
  });
}

function exibirDados(data) {
  const resultadoDiv = document.getElementById("resultado");
  const divCEP = document.createElement("div");

  divCEP.innerHTML = `
      <p>CEP: ${data.cep}</p>
      <p>Rua: ${data.logradouro}</p>
      <p>Bairro: ${data.bairro}</p>
      <p>Cidade: ${data.localidade}</p>
      <p>Estado: ${data.uf}</p>
      <p>IBGE: ${data.ibge}</p>
      <p>DDD: ${data.ddd}</p>
      <hr>
    `;
  resultadoDiv.appendChild(divCEP);
}

function inicializarMapa() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: -14.235004, lng: -51.92528 },
    zoom: 5,
  });
}

async function consultarCEP(cep) {
  try {
    if (consultandoCEP) {
      console.log("Aguarde, consulta em andamento...");
      return;
    }
    consultandoCEP = true;
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    await obterCoordenadas(data);
    exibirDados(data);
    adicionarMarcador(data.latitude, data.longitude, data.cep);
    ajustarZoom();
  } catch (error) {
    console.error("Erro ao consultar o CEP:", error);
  } finally {
    consultandoCEP = false;
  }
}

function adicionarMarcador(latitude, longitude, titulo) {
  const marcador = new google.maps.Marker({
    position: { lat: latitude, lng: longitude },
    map: map,
    title: titulo,
  });
  markers.push(marcador);
}

function ajustarZoom() {
  const bounds = new google.maps.LatLngBounds();
  markers.forEach((marker) => {
    bounds.extend(marker.getPosition());
  });
  map.fitBounds(bounds);
}
