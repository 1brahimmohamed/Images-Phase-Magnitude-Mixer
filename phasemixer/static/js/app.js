/******************************************************************************
 *
 * File Name  : app.js
 * Description: Application entry point & driver code
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/


/**  ------------------------------------------ Variables Declarations ------------------------------------------ **/


let objDraw = null;                             // object to be drawn

// boolean variables
let wantToDraw = true,                          // if the user wants to draw/drag
    isDrawing = false,                          // if the user is drawing
    circleDraw = false;                         // drawing shape (rectangle/circle)

// arrays
let shapesCanvas1 = [],                         // array of shapes on canvas 1
    shapesCanvas2 = [],                         // array of shapes on canvas 2
    operatingShapes = [],                       // array of shapes I'm operating on
    stages = [],
    layers = [];

// DOM Elements
let originalImageOne = document.getElementById('konva-container-1'),
    drawingDivWidth = originalImageOne.offsetWidth,
    drawingDivHeight = originalImageOne.offsetHeight;

// Modes
let modes = ['or', 'and', 'xor'],
    canvasStates = ['phase', 'magnitude', 'disable'];

// Default Values
let currentStage = 1,
    mode = modes[0],
    canvas1Status = canvasStates[1],
    canvas2Status = canvasStates[0];



function main() {
    // Construct 6 Konva stages on each div
    for (let i = 1; i < 6; i++) {
        const Stage = new Konva.Stage({
            height: drawingDivHeight,
            width: drawingDivWidth,
            container: `konva-container-${i}`,
        });
        stages.push(Stage)
    }

    // Construct 6 Konva layers on each stage
    for (let i = 0; i < 5; i++) {
        const layer = new Konva.Layer();
        layers.push(layer);
        stages[i].add(layer);
    }

    // ------------------ Canvas Event Listeners ------------------ //

    // stage 1
    stages[1].on('mousedown', mouseDownHandler)
    stages[1].on('mousemove', mouseMoveHandler)
    stages[1].on('mouseup', mouseUpHandler)

    // stage 3
    stages[3].on('mousedown', mouseDownHandler)
    stages[3].on('mousemove', mouseMoveHandler)
    stages[3].on('mouseup', mouseUpHandler)
}

main();
