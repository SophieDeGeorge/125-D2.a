import "./style.css";

document.body.innerHTML = `
  <h1>Draw Pad</h1>
`;

type Point = { x: number; y: number };

const lines: LineCommand[] = [];
const redoLines: LineCommand[] = [];
let curLine: LineCommand;
const brushThin: number = 1.0;
const brushThick: number = 3.0;
let curBrushSize: number = brushThin;

//#region Canvas
////////////////////////////////       Cavnas Creation         ////////////////////////////////////////////////////////

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
const cursor = { active: false, x: 0, y: 0 };
canvas.width = 256;
canvas.height = 256;
document.body.append(canvas);

canvas.addEventListener("drawing-changed", redraw);
// #endregion

//#region Mouse Input
////////////////////////////////       Mouse Input          ////////////////////////////////////////////////////////

canvas.addEventListener("mousedown", (e) => {
  cursor.active = true;

  curLine = new LineCommand({ x: e.offsetX, y: e.offsetY }, curBrushSize);
  lines.push(curLine);
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  if (cursor.active) {
    curLine.drag({ x: e.offsetX, y: e.offsetY });
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});

// On mouseUp, stop drawing
canvas.addEventListener("mouseup", (_e) => {
  cursor.active = false;
  canvas.dispatchEvent(new Event("drawing-changed"));
});
//#endregion

//#region LineCommand
////////////////////////////////       Line Command Class          ////////////////////////////////////////////////////////

class LineCommand {
  line: Point[] = [];
  brushSize: number;

  constructor(startingPoint: Point, width: number) {
    this.line = [startingPoint];
    this.brushSize = width;
  }

  display(ctx: CanvasRenderingContext2D) {
    if (this.line.length < 1) {
      return;
    }
    ctx.lineWidth = this.brushSize;
    ctx.beginPath();
    ctx.moveTo(this.line[0].x, this.line[0].y); // start at the first point
    this.line.forEach((point: Point) => ctx.lineTo(point.x, point.y)); // move endpoint to next point
    ctx.stroke();
  }

  drag(endPoint: Point) {
    this.line.push(endPoint);
  }
}
// #endregion

//#region Redraw
////////////////////////////////       Redraw Function        ////////////////////////////////////////////////////////
function redraw() {
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas from 0,0 to maxwidth, maxheight
    lines.forEach((line: LineCommand) => line.display(ctx));
    console.log("finished redraw");
  }
}
// #endregion

//#region Clear Button
////////////////////////////////       Clear Button         ////////////////////////////////////////////////////////
// Clear Button
const clearButton = document.createElement("button");
clearButton.innerHTML = "clear";
document.body.append(clearButton);

// Clear Button Event Listener
if (ctx) {
  clearButton.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lines.splice(0, lines.length);
  });
}
// #endregion

//#region Undo Button
////////////////////////////////       Undo Button         ////////////////////////////////////////////////////////
// Undo Button
const undoButton = document.createElement("button");
undoButton.innerHTML = "undo";
document.body.append(undoButton);

// Undo Button Event Listener
undoButton.addEventListener("click", () => {
  if (ctx && (lines.length > 0)) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    redoLines.push(lines.pop() as LineCommand);
    canvas.dispatchEvent(new Event("drawing-changed"));
  }
});
// #endregion

//#region Redo Button
////////////////////////////////       Redo Button         ////////////////////////////////////////////////////////
// Button
const redoButton = document.createElement("button");
redoButton.innerHTML = "redo";
document.body.append(redoButton);

// Redo button event listener
redoButton.addEventListener("click", () => {
  if (ctx && (redoLines.length > 0)) {
    lines.push(redoLines.pop() as LineCommand);
  }
  canvas.dispatchEvent(new Event("drawing-changed")); // Repeating code, Make function
});
// #endregion

//#region Thin Button
////////////////////////////////       Thin Button         ////////////////////////////////////////////////////////
// Button
const thinButton = document.createElement("button");
thinButton.innerHTML = "Thin";
thinButton.style.backgroundColor = "transparent";
if (curBrushSize == brushThin) {
  thinButton.style.backgroundColor = "yellow";
}
document.body.append(thinButton);

// Event Listener
thinButton.addEventListener("click", () => {
  if (curBrushSize != brushThin) {
    curBrushSize = brushThin;
    thinButton.style.backgroundColor = "yellow";
    thickButton.style.backgroundColor = "transparent";
  }
});
// #endregion

//#region Thick Button
////////////////////////////////       Thick Button         ////////////////////////////////////////////////////////
// Button
const thickButton = document.createElement("button");
thickButton.innerHTML = "Thick";
thickButton.style.backgroundColor = "transparent";
document.body.append(thickButton);

// Event Listener
thickButton.addEventListener("click", () => {
  if (curBrushSize != brushThick) {
    curBrushSize = brushThick;
    thickButton.style.backgroundColor = "yellow";
    thinButton.style.backgroundColor = "transparent";
  }
});
// #endregion
