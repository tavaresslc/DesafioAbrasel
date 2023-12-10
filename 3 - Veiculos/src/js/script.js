class Vehicle {
  constructor(type, model, year, brand) {
    this.type = type;
    this.model = model;
    this.year = year;
    this.brand = brand;
  }
}

class Car extends Vehicle {
  constructor(model, year, doors, brand) {
    super("Carro", model, year, brand);
    this.doors = doors;
  }
}

class Motorcycle extends Vehicle {
  constructor(model, year, passengers, brand) {
    super("Moto", model, year, brand);
    this.passengers = passengers;
    this.wheels = 2;
  }
}

function showFields(type) {
  if (type === "Carro") {
    carFields.classList.add("selected");
    motorcycleFields.classList.remove("selected");
  } else if (type === "Moto") {
    carFields.classList.remove("selected");
    motorcycleFields.classList.add("selected");
  }
}

document.getElementById("vehicleType").addEventListener("change", function () {
  const selectedType = this.value;
  showFields(selectedType);
});

function limitNumber(input) {
  const max = parseInt(input.getAttribute("max"));
  const min = parseInt(input.getAttribute("min"));
  let value = parseInt(input.value);

  if (isNaN(value)) {
    value = min;
  }

  if (value > max) {
    input.value = max;
  } else if (value < min) {
    input.value = min;
  }
}

document
  .getElementById("vehicleForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedType = document.getElementById("vehicleType").value;
    const inputs = document.getElementsByTagName("input");
    let isAnyFieldEmpty = false;

    if (selectedType === "Carro") {
      for (let i = 0; i < 4; i++) {
        if (inputs[i].value === "") {
          isAnyFieldEmpty = true;
          break;
        }
      }
    } else if (selectedType === "Moto") {
      for (let i = 4; i < 8; i++) {
        if (inputs[i].value === "") {
          isAnyFieldEmpty = true;
          break;
        }
      }
    }

    if (isAnyFieldEmpty) {
      alert("Preencha todos os campos!");
      return;
    }

    let vehicleData;
    if (selectedType === "Carro") {
      vehicleData = new Car(
        document.getElementById("carModel").value.trim(),
        parseInt(document.getElementById("carYear").value),
        parseInt(document.getElementById("carDoors").value),
        document.getElementById("carBrand").value.trim()
      );
    } else if (selectedType === "Moto") {
      vehicleData = new Motorcycle(
        document.getElementById("motoModel").value.trim(),
        parseInt(document.getElementById("motoYear").value),
        parseInt(document.getElementById("motoPassengers").value),
        document.getElementById("motoBrand").value.trim()
      );
    }

    const storedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
    storedVehicles.push(vehicleData);
    localStorage.setItem("vehicles", JSON.stringify(storedVehicles));

    document.getElementById("vehicleForm").reset();
    showVehicleList();
    consoleVehicleList();
    location.reload();
  });

function showVehicleList() {
  const vehicleList = document.getElementById("vehicleList");
  vehicleList.innerHTML = "";

  const storedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

  if (storedVehicles.length === 0) {
    vehicleList.innerHTML = "<p>Nenhum veículo cadastrado ainda.</p>";
  } else {
    storedVehicles.forEach((vehicle, index) => {
      const vehicleItem = document.createElement("tr");
      vehicleItem.classList.add("vehicle-item");

      let vehicleInfo = `
          <td><h3>${index + 1}.</h3></td>
          <td><strong>Tipo: </strong>${vehicle.type}</td>
          <td><strong>Modelo: </strong>${vehicle.model}</td>
          <td><strong>Ano: </strong>${vehicle.year}</td>
          <td><strong>Marca: </strong>${vehicle.brand}</td>
        `;

      if (vehicle.type === "Carro") {
        vehicleInfo += `<td><strong>Portas: </strong>${vehicle.doors}</td>`;
      } else if (vehicle.type === "Moto") {
        vehicleInfo += `<td><strong>Passageiros: </strong>${vehicle.passengers}</td>`;
        vehicleInfo += `<td><strong>Rodas: </strong>${vehicle.wheels}</td>`;
      }

      vehicleInfo += `<td><button class="delete-button" onclick="deleteVehicle(${index})"><i class="fas fa-times"></i></button></td>`;

      vehicleItem.innerHTML = vehicleInfo;
      vehicleList.appendChild(vehicleItem);
    });
  }
}

function consoleVehicleList() {
  const storedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];

  if (storedVehicles.length === 0) {
    console.log("Nenhum veículo cadastrado ainda.");
  } else {
    storedVehicles.forEach((vehicle, index) => {
      console.log(`Veículo ${index + 1}:`);
      console.log(`Tipo: ${vehicle.type}`);
      console.log(`Modelo: ${vehicle.model}`);
      console.log(`Ano: ${vehicle.year}`);
      console.log(`Marca: ${vehicle.brand}`);

      if (vehicle.type === "Carro") {
        console.log(`Portas: ${vehicle.doors}`);
      } else if (vehicle.type === "Moto") {
        console.log(`Passageiros: ${vehicle.passengers}`);
        console.log(`Rodas: ${vehicle.wheels}`);
      }

      console.log("-------------------");
    });
  }
}

function deleteVehicle(index) {
  const storedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  storedVehicles.splice(index, 1);

  localStorage.setItem("vehicles", JSON.stringify(storedVehicles));
  showVehicleList();
  location.reload();
}

function loadVehiclesFromJSON() {
  const storedVehicles = JSON.parse(localStorage.getItem("vehicles")) || [];
  fetch("veiculos.json")
    .then((response) => response.json())
    .then((data) => {
      if (data && data.vehicles && data.vehicles.length > 0) {
        data.vehicles.forEach((vehicle) => {
          const existingVehicle = storedVehicles.find(
            (v) =>
              v.model === vehicle.model &&
              v.year === vehicle.year &&
              v.brand === vehicle.brand
          );
          if (!existingVehicle) {
            storedVehicles.unshift(vehicle);
          }
        });
        localStorage.setItem("vehicles", JSON.stringify(storedVehicles));
        showVehicleList();
        consoleVehicleList();
      }
    })
    .catch((error) => {
      console.error("Erro ao carregar veículos do JSON:", error);
    });
}

loadVehiclesFromJSON();
