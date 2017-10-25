# humanlines

A NPM package to draw lines that look like they were created by a human. Because who wants boring straight lines anyway? See [this blog post](https://rmarcus.info/blog/2017/10/23/humanlines.html) for more information.

![Cube and hand-drawn cube](https://raw.githubusercontent.com/RyanMarcus/humanLines/master/cube.png)

```
npm install --save humanlines
```


Usage example:

```javascript
const humanLines = require("humanlines");

// generate a pencil-like texture... (optional)
const texture = humanLines.generatePencilTexture();

const canvas = document.getElementById("cube");
const ctx = canvas.getContext("2d");
const pattern = ctx.createPattern(texture, 'repeat');

ctx.strokeStyle = pattern;
ctx.lineWidth = 3;
const a = 10;
const w = 160;
ctx.clearRect(0, 0, 1000, 1000);

ctx.translate(250, 0);
humanLines.drawRect(ctx, a, a, w, w);
humanLines.drawRect(ctx, a + w/3, a + w/3, w, w);

humanLines.drawLine(ctx, a, a, a + w/3, a + w/3);
humanLines.drawLine(ctx, a, a + w, a + w/3, a + w/3 + w);
humanLines.drawLine(ctx, a + w, a, a + w/3 + w, a + w/3);
humanLines.drawLine(ctx, a + w, a + w, a + w/3 + w, a + w/3 + w);
```

