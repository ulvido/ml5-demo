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

// -- ML5.js
let options = {
  inputs: ["x", "y"],
  outputs: ["label"],
  task: "classification", // sonuç ne kadar C, ne kadar D, ne kadar E; 3ünün de ihtimalini verir (confidence ile). https://youtu.be/8HEgeAbYphA?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  // task: "regression", // sonuç daha çok slider gibi C, D, E arasındaki bir değeri de verebilir. tüm inputları hesaba katan tek bir sonuç verir. rakam alır rakam verir. https://youtu.be/fFzvwdkzr_c?list=PLRqwX-V7Uu6YPSwT06y_AEYTqIwbeam3y
  debug: true,
}

ml5.setBackend("webgl");

let model = ml5.neuralNetwork(options);

console.log(model);

// LABEL NAME
let targetLabel = "C";

document.body.addEventListener("keydown", e => {
  // console.log(e) // switch-case çalışmıyor
  // console.log(e.ctrlKey) // switch-case çalışmıyor

  if (e.code === "Quote") changeState(STATE.idle);

  if (e.code === "KeyC" || e.code === "KeyD" || e.code === "KeyE") changeState(STATE.collection);
  if (e.code === "KeyC") targetLabel = "C";
  if (e.code === "KeyD") targetLabel = "D";
  if (e.code === "KeyE") targetLabel = "E";

  if (e.code === "KeyT") {
    trainModel();
  };

  if (e.code === "KeyP") {
    changeState(STATE.prediction);
    console.log("STATE: prediction");
  };


  // save training data
  if (e.code === "KeyS") {
    model.saveData("data-classification", dataSaved); // data-classification.json
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
  console.log("model train ended");
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
    drawLabel(item.xs.x, item.xs.y, item.ys.label);
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
  model.loadData("classification/data.json", dataLoaded({ train: false }))
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
  //   model: "model/classification/model.json",
  //   metadata: "model/classification/model_meta.json",
  //   weights: "model/classification/model.weights.bin",
  // };
  // model.load(modelInfo, modelLoaded)

  // Yöntem - II // sadece model.json pathını vermek. (diğer iki dosya yanında olmalı)
  // model.load("model/classification/model.json", modelLoaded)

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
    let output = { label: targetLabel };
    model.addData(input, output);
  } else if (currentState === STATE.prediction) {
    model.classify(input, gotResult(e.clientX, e.clientY));
  }
})

const gotResult = (x, y) => (result, error) => {
  if (error) { console.error(error); return; };
  // console.log(result);
  drawLabel(x, y, result[0].label);
}
