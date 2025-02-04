const info = document.getElementById("info");
const sharedView = document.getElementById("shared-view");
document.body.removeChild(sharedView);

let title = document.createElement("h4");
document.body.appendChild(title);

let wrapper = document.createElement("div");
wrapper.style.display = "flex";
wrapper.style.gap = "20px";
document.body.appendChild(wrapper);

let buttons = document.createElement("div");
buttons.style.display = "flex";
buttons.style.gap = "8px";
buttons.style.flexDirection = "column";
wrapper.appendChild(buttons);

let content = document.createElement("pre");
content.id = "content";
content.classList.add("demo-content");
wrapper.appendChild(content);



// -- DOM helper functions
const createButton = (text, onClickFunc) => {
  let input = document.createElement("input");
  input.type = "button";
  input.value = text;
  input.style.marginLeft = "8px";
  input.onclick = () => {
    title.innerText = text;
    onClickFunc();
  };
  buttons.appendChild(input);
}

createButton("XOR", () => {
  info.innerHTML = "XOR çalıştı logları kontrol et.";
  import("./xor.js");
})

createButton("COLOR - BRIGHTNESS", () => {
  info.innerHTML = "COLOR - BRIGHTNESS çalıştı logları kontrol et.";
  import("./color-brightness.js");
})

createButton("FREE-MEAL", () => {
  info.innerText = "FREE-MEAL çalıştı logları kontrol et.\n\
  Haftanın her bir günü başka restoranda çocuk menüsü bedava.\n\
  Güne göre çocuklara bedava menü alabilmek için hangi restorana gitmeliyim?";
  import("./free-meal.js");
})