let content = document.getElementById("content");

// const convertBase64 = (file) => new Promise((resolve, reject) => {
//   const fileReader = new FileReader();
//   fileReader.readAsDataURL(file);

//   fileReader.onload = () => {
//     if (typeof fileReader.result == "string") {
//       resolve(fileReader.result);
//     }
//   };
// });


// ML5.js
ml5.setBackend("webgl");

let model = ml5.imageClassifier("MobileNet");

const gotResult = (result) => {
  console.log(result);
};

fetch("demo/image-numbers/images/496301.png")
  .then(res => res.blob())
  .then(blob => {
    let image = new Image(150, 50);
    image.src = URL.createObjectURL(blob);
    content.innerHTML += "image data:\n";
    content.appendChild(image);
    model.classify(image, gotResult);
  });
