// ELEMENTS
let stateEl = document.getElementById("state");
let currentLabelEl = document.getElementById("currentLabel");
let trainingDataEl = document.getElementById("pick-training-data");
let trainingDataBtnEl = document.getElementById("load-training-data-btn");
let modelEl = document.getElementById("pick-model");
let modelBtnEl = document.getElementById("load-model-btn");

// -- DOM helper functions
const drawLabel = (x, y, label) => {
  let div = document.createElement("div");
  div.style.position = "absolute";
  div.style.left = x + "px";
  div.style.top = y + "px";
  div.innerHTML = label;
  document.body.appendChild(div);
  return div;
}

const changeState = (state) => {
  currentState = state;
  stateEl.innerHTML = state;
}

// -- state
const STATE = {
  idle: "IDLE",
  collection: "COLLECTION",
  training: "TRAINING",
  prediction: "PREDICTION",
}

let currentState;
changeState(STATE.idle);

let numbers = {
  "1": 1.0,
  "2": 2.0,
  "3": 3.0,
  "4": 4.0,
  "5": 5.0,
  "6": 6.0,
  "7": 7.0,
}

// -- ML5.js
let options = {
  inputs: ["x", "y"],
  outputs: ["frequency"],
  // task: "classification", // sonuç ne kadar C, ne kadar D, ne kadar E; 3ünün de ihtimalini verir (confidence ile). https://youtu.be/8HEgeAbYphA?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  task: "regression", // sonuç daha çok slider gibi C, D, E arasındaki bir değeri de verebilir. tüm inputları hesaba katan tek bir sonuç verir. rakam(lar) alır tek rakam verir. https://youtu.be/fFzvwdkzr_c?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  debug: true,
}

ml5.setBackend("webgl");

let model = ml5.neuralNetwork(options);

console.log(model);

// LABEL NAME
let targetLabel = "1";
let keyCodeList = ["Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7"];

document.body.addEventListener("keydown", e => {
  // console.log(e) // switch-case çalışmıyor
  // console.log(e.ctrlKey) // switch-case çalışmıyor

  if (e.code === "Quote") changeState(STATE.idle);

  if (keyCodeList.includes(e.code)) changeState(STATE.collection);
  if (e.code === "Digit1") targetLabel = "1";
  if (e.code === "Digit2") targetLabel = "2";
  if (e.code === "Digit3") targetLabel = "3";
  if (e.code === "Digit4") targetLabel = "4";
  if (e.code === "Digit5") targetLabel = "5";
  if (e.code === "Digit6") targetLabel = "6";
  if (e.code === "Digit7") targetLabel = "7";

  if (e.code === "KeyT") {
    trainModel();
  };

  if (e.code === "KeyP") {
    changeState(STATE.prediction);
    console.log("STATE: prediction");
  };


  // save training data
  if (e.code === "KeyS") {
    model.saveData("data", dataSaved); // data.json
  };
  // load training data
  if (e.code === "KeyL") {
    window.showOpenFilePicker({
      types: [
        {
          description: "Training Data",
          accept: {
            "application/json": [".json"],
          },
        },
      ],
      excludeAcceptAllOption: true,
      multiple: false,
    }).then(async handles => {
      const file = await handles[0].getFile();
      let url = URL.createObjectURL(file);
      model.loadData(url, dataLoaded({ train: true }));
    })
  };
  // save modal - Ctrl M
  if (e.ctrlKey && e.code === "KeyM") {
    model.save("model", modelSaved);
  };
  // load modal - M
  if (!e.ctrlKey && e.code === "KeyM") {
    let input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.addEventListener("change", e => {
      model.load(e.target.files, modelLoaded);
      input.remove();
    });
    input.click();
  };
})

const dataSaved = () => {
  console.log("save data done");
}
const modelSaved = () => {
  console.log("save model done");
}

const whileTraining = (epoch, loss) => {
  // console.log({ epoch }, { loss });
}

const finishedTraining = () => {
  console.log("model train ended", model);
  changeState(STATE.prediction);
}

const trainModel = () => {
  changeState(STATE.training);
  console.log("model train started...");
  model.normalizeData(); // veriyi 0-1 arası haline getirsin.
  let options = {
    epochs: 32,
    batchSize: 16,
  }
  model.train(options, whileTraining, finishedTraining);
}

const dataLoaded = (options = { train: false }) => () => {
  model.neuralNetworkData.data.raw.forEach(item => {
    drawLabel(item.xs.x, item.xs.y, item.ys.frequency);
  });
  changeState(STATE.prediction);
  options?.train && trainModel();
  // console.log("MODEL", model);
}

const modelLoaded = () => {
  // model.neuralNetworkData.data.raw.forEach(item => {
  //   drawLabel(item.xs.x, item.xs.y, item.ys.label);
  // });
  // trainModel();
  changeState(STATE.prediction);
  console.log("MODEL", model);
  // model yüklendi ama içinde data yok. model datanın nerden geldiğini bilmez 
  // zaten eğtilmiş haldedir. noktaları tekrar çizdirmek istersen datayı da ayrıyetten yüklemen gerekir.
  model.loadData("regression/data.json", dataLoaded({ train: false }))
}

// EVENTS
trainingDataBtnEl.addEventListener("click", e => {
  const file = trainingDataEl.files[0];
  let url = URL.createObjectURL(file);
  model.loadData(url, dataLoaded({ train: true }))
})
modelBtnEl.addEventListener("click", e => {
  // Yöntem - I // hepsinin pathını vermek
  // const modelInfo = {
  //   model: "model/regression/model.json",
  //   metadata: "model/regression/model_meta.json",
  //   weights: "model/regression/model.weights.bin",
  // };
  // model.load(modelInfo, modelLoaded)

  // Yöntem - II // sadece model.json pathını vermek. (diğer iki dosya yanında olmalı)
  // model.load("model/regression/model.json", modelLoaded)

  // Yöntem - III // dosya seçme. 3ünü de seçmelisin.
  const files = modelEl.files;
  model.load(files, modelLoaded)
})

// ADD POINTS
document.addEventListener("click", e => {
  // console.log(e.clientX, e.clientY, targetLabel);
  let input = { x: e.clientX, y: e.clientY };
  if (currentState === STATE.collection) {
    drawLabel(e.clientX, e.clientY, targetLabel);
    let output = { frequency: numbers[targetLabel] };
    model.addData(input, output);
  } else if (currentState === STATE.prediction) {
    model.predict(input, gotResult(e.clientX, e.clientY));
  }
})

const gotResult = (x, y) => (result, error) => {
  if (error) { console.error(error); return; };
  // console.log(result);
  let label = drawLabel(x, y, result[0].frequency.toFixed(3));
  label.style.color = "blue";
}
