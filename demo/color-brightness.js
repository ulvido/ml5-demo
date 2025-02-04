const content = document.getElementById("content");

const colors = [
  { red: 0.0, green: 0.2, blue: 0.4 },
  { red: 0.0, green: 0.4, blue: 0.6 },
  { red: 0.2, green: 0.8, blue: 0.8 },
  { red: 0.8, green: 0.0, blue: 0.0 },
];

const brightnesses = [
  { "dark": 0.8 },
  { "neutral": 0.8 },
  { "light": 0.7 },
  { "dark": 0.85 },
];

// -- ML5.js
let options = {
  inputs: ["red", "green", "blue", "brightness"],
  outputs: ["label"],
  task: "classification", // sonuç ne kadar C, ne kadar D, ne kadar E; 3ünün de ihtimalini verir (confidence ile). https://youtu.be/8HEgeAbYphA?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  // task: "regression", // sonuç daha çok slider gibi C, D, E arasındaki bir değeri de verebilir. tüm inputları hesaba katan tek bir sonuç verir. rakam alır rakam verir. https://youtu.be/fFzvwdkzr_c?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  debug: true,
};

ml5.setBackend("webgl");

let model = ml5.neuralNetwork(options);

let data = [];

for (let i = 0; i < colors.length; i++) {
  const input = { ...colors[i], brightness: Object.values(brightnesses[i])[0] };
  const output = Object.keys(brightnesses[i])[0];
  data.push({ input, label: output });

  model.addData(input, { label: output });
}

content.innerText += JSON.stringify({ data }, null, 2) + "\n";

// -- train model
model.normalizeData(); // veriyi 0-1 arası haline getirsin.

let optionsTraining = {
  epochs: 32,
  batchSize: 12,
}

const gotResult = (result) => {
  content.innerText += JSON.stringify({ result }, null, 2) + "\n";
  console.log("result: ", result[0].label);
}

const whileTraining = () => { }

const finishedTraining = () => {
  console.log("training finished", model);
  model.classify({ red: 0.9, green: 0.0, blue: 0.0, brightness: 0.8 }, gotResult)
}

model.train(optionsTraining, whileTraining, finishedTraining);