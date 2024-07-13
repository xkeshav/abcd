# Issue

```html
<label class="vertical" for="vertical">
  <input type="radio" class="orientation" name="orientation" id="vertical" value="X" />
</label>
<section class="scene">
  <div class="panel"></div>
</section>
```

## panel.ts

```js
const orientationPanel = document.querySelectorAll(".orientation");
const panel = document.querySelector(".panel");

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
  updatePanel(Number(e.keyCode));
};

orientationPanel?.addEventListener("change", onChangePanel);
```

```astro
---

import "@/assets/styles/nav.css";
---
<nav class="nav">
  <div class="nav--list">
    <a class="link list--item" href="/panel" client:load><span>Panel</span></a>
  </div>
</nav>

```