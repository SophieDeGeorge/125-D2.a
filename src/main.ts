import "./style.css";

document.body.innerHTML = `
  <h1>Draw Pad</h1>
`;

////////////////////////////////       Cavnas Creation         ////////////////////////////////////////////////////////
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
document.body.append(canvas);

const ctx = canvas.getContext("2d");

const cursor = { active: false, x: 0, y: 0 };

////////////////////////////////       Mouse Input          ////////////////////////////////////////////////////////
// Record Mouse Click Over Canvas
canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;
  cursor.x = e.offsetX;
  cursor.y = e.offsetY;
});

// On click, draw
canvas.addEventListener("mousemove", (e) => {
  if (cursor.active && ctx) {
    ctx.beginPath();
    ctx.moveTo(cursor.x, cursor.y);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    cursor.x = e.offsetX;
    cursor.y = e.offsetY;
  }
});

// On mouseUp, stop drawing
canvas.addEventListener("mouseup", (e) => {
  cursor.active = false;
});

////////////////////////////////       Clear Button         ////////////////////////////////////////////////////////
// Clear Button
const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
document.body.append(clearButton);

// Clear Button Event Listener
if (ctx) {
  clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}
