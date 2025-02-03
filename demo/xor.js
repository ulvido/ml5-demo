const content = document.getElementById("content");

// DATA
let data = [
  { x1: 0, x2: 0, result: "0" },
  { x1: 1, x2: 0, result: "1" },
  { x1: 0, x2: 1, result: "1" },
  { x1: 1, x2: 1, result: "0" },
]

content.innerText += JSON.stringify({ data }, null, 2) + "\n";

// -- ML5.js
const options = {
  inputs: ["x1", "x2"],
  outputs: ["result"],
  task: "classification", // sonuç ne kadar C, ne kadar D, ne kadar E; 3ünün de ihtimalini verir (confidence ile). https://youtu.be/8HEgeAbYphA?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  // task: "regression", // sonuç daha çok slider gibi C, D, E arasındaki bir değeri de verebilir. tüm inputları hesaba katan tek bir sonuç verir. rakam alır rakam verir. https://youtu.be/fFzvwdkzr_c?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  debug: true,
};

ml5.setBackend("webgl");

let model = ml5.neuralNetwork(options);

// -- add data to model
for (let i = 0; i < data.length; i++) {
  const element = data[i];
  const inputs = [element.x1, element.x2];
  const outputs = [element.result];
  console.log({ inputs }, { outputs })
  model.addData(inputs, outputs);
}

// -- train model
// model.normalizeData(); // veriyi 0-1 arası haline getirsin. bunda gerek yok

let optionsTraining = {
  epochs: 32,
  batchSize: 12,
}

const gotResult = (result) => {
  console.log(result);
  content.innerText += JSON.stringify({ result: result[0].label }, null, 2) + "\n";
};

const whileTraining = () => { };

const finishedTraining = () => {
  console.log("training finished.", model);
  classify([0, 0]);
  // classify([1, 0]);
}

const classify = (input) => {
  content.innerText += JSON.stringify({ classify: input }, null, 2) + "\n";
  model.classify(input, gotResult)
}

console.log("model train started...");

model.train(optionsTraining, whileTraining, finishedTraining);  