let content = document.getElementById("content");

const data = [
  { weekday: "Pazartesi", restaurant: "Kebap Park" },
  { weekday: "Salı", restaurant: "Suat Pide" },
  { weekday: "Çarşamba", restaurant: "Burger King" },
  { weekday: "Perşembe", restaurant: "Popoyes" },
  { weekday: "Cuma", restaurant: "Has Döner" },
  { weekday: "Cumartesi", restaurant: "Bursa Park İskender" },
  { weekday: "Pazar", restaurant: "Balıkçım" },
]

content.innerHTML += JSON.stringify({ data }, null, 2) + "\n\n";

// defaults (başta hepsi sıfır lazım olanı 1 yapacaz)
const weekdays = {
  "Pazartesi": 0.0,
  "Salı": 0.0,
  "Çarşamba": 0.0,
  "Perşembe": 0.0,
  "Cuma": 0.0,
  "Cumartesi": 0.0,
  "Pazar": 0.0,
}

// ML5.js
const options = {
  inputs: Object.keys(weekdays),
  outputs: ["restaurant"],
  task: "classification",
  debug: true,
};

ml5.setBackend("webgl");

let model = ml5.neuralNetwork(options);

for (let i = 0; i < data.length; i++) {
  const element = data[i];
  model.addData({ ...weekdays, [element.weekday]: 1.0 }, { restaurant: element.restaurant });
}

// -- train model
// model.normalizeData(); // veriyi 0-1 arası haline getirsin. burada lazım değil.

const optionsTraining = {
  epochs: 100,
  batchSize: 14,
}

const gotResult = (result) => {
  console.log(result[0].label);
  content.innerHTML += JSON.stringify({ result: { restaurant: result[0].label } }, null, 2) + "\n"; // classification
};

const findFreeRestaurantForDay = (dayName) => {
  content.innerHTML += JSON.stringify({ classify: { [dayName]: 1 } }, null, 2) + "\n"; // classification
  model.classify({ ...weekdays, [dayName]: 1.0 }, gotResult);
}

const whileTraining = () => { };

const trainingFinished = () => {
  console.log("Training finished: ", model);
  findFreeRestaurantForDay("Pazartesi");
  findFreeRestaurantForDay("Çarşamba");
  findFreeRestaurantForDay("Cumartesi");
};

model.train(optionsTraining, whileTraining, trainingFinished);