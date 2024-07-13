import { isAlphabet } from "./common";

const panel = document.querySelector(".panel") as HTMLElement;
const cellRange = document.getElementById("range") as HTMLInputElement;
const orientationPanel = document.querySelectorAll(".orientation");
const panelOptionDiv = document.querySelector("#panel__options");

let orientation: string;

let selectedIndex = 0;
const cellWidth = panel?.offsetWidth;
let radius: number, theta: number;

const rotatePanel = ({ rotate = "rotateX" }) => {
  const angle = theta * selectedIndex;
  const transformString = `translateZ(-${radius}px) ${rotate}(${angle}deg)`;
  panel.style.transform = transformString;
};

const updatePanel = (num = 0) => {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < num; i++) {
    const div = document.createElement("div");
    div.classList.add("panel__cell");
    div.textContent = String.fromCodePoint(65 + i); // A to Z
    fragment.appendChild(div);
  }
  panel.innerHTML = "";
  panel.appendChild(fragment);
};

const onChangePanel = (e: any) => {
  changePanel(e.target.value);
};

const changePanel = ({ orientation = "Y" }) => {
  const rotate = `rotate${orientation}`;
  const radioInput = document.querySelectorAll("input[type=radio]");
  radioInput.forEach((r: any) => (r.checked = r.defaultValue === orientation));
  const cellCount = Number(cellRange.value);
  updatePanel(cellCount);
  theta = 360 / cellCount;
  const cells = document.querySelectorAll(".panel__cell");
  const halfCell = cellWidth / 2;
  const divideBy = Math.tan(Math.PI / cellCount);
  radius = Math.round(halfCell / divideBy);
  cells.forEach((cell, i) => {
    const cellAngle = theta * i;
    const transformString = `${rotate}(${cellAngle}deg) translateZ(${radius}px)`;
    (cell as HTMLElement).style.transform = transformString;
  });
  rotatePanel({ rotate });
};

//const onOrientationChange = (e: any) => {
//  orientation = e.target.value;
//const key = modifiers: [shift], code: KeyA, keyCode: 65, key: A

//  console.log({ orientation });
//  //e.target.closest('label').classList.add('selected');
//  changePanel({ orientation });
//};

const onKeyChange = (e: any) => {
  const { keyCode } = e;
  //let orientation;
  switch (keyCode) {
    case 39: {
      // ArrowRight
      selectedIndex++;
      orientation = "Y";
      break;
    }
    case 37: {
      // ArrowLeft
      selectedIndex--;
      orientation = "Y";
      break;
    }
    case 38: {
      // ArrowUp
      selectedIndex++;
      orientation = "X";
      break;
    }
    case 40: {
      // ArrowDown
      selectedIndex--;
      orientation = "X";
      break;
    }
    default: {
      if (isAlphabet(keyCode)) {
        selectedIndex = 65 - keyCode;
      } else {
        selectedIndex--;
      }
    }
  }
  changePanel({ orientation });
};

//orientationPanel.forEach((radio) => {
//  radio.addEventListener("click", onOrientationChange, false);
//});

cellRange?.addEventListener("change", onChangePanel);
document.addEventListener("keydown", onKeyChange);

updatePanel();

export { updatePanel };
