// ELEMENTS
let sharedView = document.getElementById("shared-view");
let task = document.getElementById("task");
let info = document.getElementById("info");

let buttons = [];

// -- DOM helper functions
const createButton = (text, onClickFunc) => {
  let input = document.createElement("input");
  input.type = "button";
  input.value = text;
  input.onclick = () => {
    task.innerText = text;
    sharedView.style.display = "block";
    buttons.forEach(btn => document.body.removeChild(btn));
    onClickFunc();
  };
  buttons.push(input);
  document.body.appendChild(input);
}

createButton("CLASSIFICATION", () => {
  info.innerText = "\
DATA GENERATION: C,D,E harflerine bastıktan sonra ekrana tıklayıp data oluştur.\n\
TRAINING: T harfine basarak eğit. Model hazır.\n\
PREDICTION: Artık P harfine basarak ekrana tıklayıp tahmin etmesine bakabilirsin.\n\
S: save data\n\
L: load data. (NŞA'da load ettikten sonra kullanmak için bir de T ile train etmen gerekir. ben otomatik yaptırdım.)\n\
Ctrl+M: save model\n\
M: load model (3 dosyayı da seç)\n\
"
  import("./classification/index.js");
})
createButton("REGRESSION", () => {
  info.innerText = "\
  DATA GENERATION: 1,2,3,4,5,6,7 bastıktan sonra ekrana tıklayıp data oluştur.\n\
  TRAINING: T harfine basarak eğit. Model hazır.\n\
  PREDICTION: Artık P harfine basarak ekrana tıklayıp tahmin etmesine bakabilirsin.\n\
  S: save data\n\
  L: load data. (NŞA'da load ettikten sonra kullanmak için bir de T ile train etmen gerekir. ben otomatik yaptırdım.)\n\
  Ctrl+M: save model\n\
  M: load model (3 dosyayı da seç)\n\
  "
  import("./regression/index.js");
})
