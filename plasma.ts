const width = 250;
const height = 250;
const fps = 30;
const animationSpeed = 5;
let timeElapsed = 0;

const palette = createRGBPalette();
const matrix1 = createGrayscaleMatrix();
const matrix2 = createGrayscaleMatrix();

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const display = ctx.createImageData(width, height);

canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createGrayscaleMatrix() {
  const matrix: number[][] = [];

  for (let i = 0; i <= width * 4; i++) {
    const row = [];

    for (let j = 0; j <= height * 4; j++) {
      row.push(
        64 +
          63 *
            Math.sin(i / (30 + 10 * Math.cos(j / 74))) *
            Math.cos(j / (50 + 10 * Math.sin(i / 60)))
      );
    }

    matrix.push(row);
  }

  return matrix;
}

function createRGBPalette() {
  const palette: number[][] = [];

  const randR = randInt(0, 255);
  const randG = randInt(0, 255);
  const randB = randInt(0, 255);

  for (let i = 0; i < 256; i++) {
    const red = randR + 71 * Math.cos((i * Math.PI) / 128 + timeElapsed / 74);
    const green = randG + 71 * Math.sin((i * Math.PI) / 128 + timeElapsed / 63);
    const blue = randB - 71 * Math.cos((i * Math.PI) / 128 + timeElapsed / 81);
    palette.push([red, green, blue]);
  }

  return palette;
}

function setPixel(x: number, y: number, color: number[]) {
  const [r, g, b] = color;
  const index = (x + y * width) * 4;
  display.data[index + 0] = r;
  display.data[index + 1] = g;
  display.data[index + 2] = b;
  display.data[index + 3] = 255; // Alpha
}

function displayImage() {
  ctx.putImageData(display, 0, 0);
}

function animate() {
  const cos = 100 * Math.cos((timeElapsed * Math.PI) / 360);
  const sin = 100 * Math.sin((timeElapsed * Math.PI) / 360);

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const [x1, y1] = [
        Math.floor(width * 2 + x + cos),
        Math.floor(height * 2 + y + sin),
      ];
      const [x2, y2] = [
        Math.floor(width * 2 + x + sin),
        Math.floor(height * 2 + y + cos),
      ];

      const grays = [matrix1[x1][y1], matrix2[x2][y2]];
      const colorIndex = Math.floor(grays[0] + grays[1] / 2);
      const color = palette[colorIndex > 255 ? 255 : colorIndex];
      setPixel(x, y, color);
    }
  }

  displayImage();

  setTimeout(() => {
    timeElapsed += animationSpeed;
    requestAnimationFrame(animate);
  }, 1000 / fps);
}

animate();
