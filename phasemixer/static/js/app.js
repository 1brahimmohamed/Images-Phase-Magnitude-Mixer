let objDraw = null,                             // object to be drawn
    isDrawing = false,                          // boolean to know if i am drawing
    circleDraw = false,                         // boolean to toggle drawing shape (rectangle/circle)
    shapesCanvas1 = [],                         // array of drawn operatingShapes for the first canvas
    shapesCanvas2 = [],                         // array of drawn operatingShapes for the second canvas
    stages = [],                                // array of stages
    layers = [];                                // array of layers[0]s

let originalImageOne = document.getElementById('konva-container-1'),       // get the first div to get its width & height
    drawingDivWidth = originalImageOne.offsetWidth,             // canvas width
    drawingDivHeight = originalImageOne.offsetHeight;           // canvas height

let currentStage = 1,                           // current stage I am drawing onto
    operatingShapes;                            // variable to hold array of target array of shapes

let wantToDraw = true;                          // boolean to enable/disable drawing when moving shapes

const index = 1;

let modes = ['all', 'intersect', 'difference','uni-phase', 'uni-mag'];
let mode = modes[0];

// Construct 6 Konva stages on each div
for (let i = 1; i < 6; i++) {
    const Stage = new Konva.Stage({
        height: drawingDivHeight,               // every stage have the same height
        width: drawingDivWidth,                 // every stage have the same width
        container: `konva-container-${i}`,      // id of the div in HTML
    });
    stages.push(Stage)                          // push stage to stages array to store it and access it via index
}

// Construct 6 Konva layers on each stage
for (let i = 0; i < 5; i++) {
    const layer = new Konva.Layer();
    layers.push(layer);                         // push layer to layers array to store it and access it via index
    stages[i].add(layer);                       // add each layer to its corresponding stage
}

/**
 * Function which is executed when the user clicks on the canvas
 * @param event
 * @returns __
 **/
let mouseDownHandler = (event) => {

    // first we need detect which canvas we are attempting to use
    currentStage = detectCanvas(event);

    // get the position of the mouse on click down
    let x_current = stages[currentStage].getPointerPosition().x,
        y_current = stages[currentStage].getPointerPosition().y;

    // choose which shapes array to store to
    currentStage === 1 ? operatingShapes = shapesCanvas1 : operatingShapes = shapesCanvas2

    // check if the mouse position is on one of our drawn shapes
    wantToDraw = checkDraw(x_current, y_current);

    // if I don't want to draw then exit the function
    if (!wantToDraw)
        return;

    isDrawing = true;

    // check which shape I am drawing
    if (circleDraw === false) {
        objDraw = drawRectangle(x_current, y_current);
    } else {
        objDraw = drawEllipse(x_current, y_current);
    }

    layers[currentStage].add(objDraw).batchDraw();
}


/**
 * Function which is executed when the user moves on the canvas
 * @param event
 * @returns boolean
 **/
let mouseMoveHandler = (event) => {

    // if I don't want to draw then exit the function
    if (!wantToDraw)
        return false;

    if (!isDrawing) {
        return false;
    }

    if (circleDraw === false) {
        objDraw.width(stages[currentStage].getPointerPosition().x - objDraw.x());
        objDraw.height(stages[currentStage].getPointerPosition().y - objDraw.y());
        layers[currentStage].batchDraw();
    } else {
        // rise = Math.pow(stages[currentStage].getPointerPosition().y - objDraw.y(), 2);
        // run = Math.pow(stages[currentStage].getPointerPosition().x - objDraw.x(), 2);
        // const newRaduis = Math.sqrt(rise + run);
        // objDraw.radius(newRaduis);
        objDraw.radiusX(Math.abs(stages[currentStage].getPointerPosition().x - objDraw.x()));
        objDraw.radiusY(Math.abs(stages[currentStage].getPointerPosition().y - objDraw.y()));
        layers[currentStage].batchDraw();
    }

    layers[currentStage].batchDraw()
}

/**
 * function which is executed when the user releases the mouse button
 * @param event
 * @returns __
 **/
let mouseUpHandler = (event) => {

    // if I move the shape then do nothing but enable drawing again
    if (!wantToDraw) {
        sendRequest(shapesCanvas1, shapesCanvas2, mode);
        wantToDraw = true;
        return;
    }

    // to normalize the inputs if the user draw it backward
    if (objDraw.width() < 0 || objDraw.height() < 0){
        objDraw.x(objDraw.x() + objDraw.width())
        objDraw.y(objDraw.y() + objDraw.height())
        objDraw.width(Math.abs(objDraw.width()))
        objDraw.height(Math.abs(objDraw.height()))
    }


    isDrawing = false;                                       // disable drawing

    // push the shape to the array of shape of its canvas
    currentStage === 1 ? operatingShapes = shapesCanvas1.push(objDraw) : shapesCanvas2.push(objDraw);

    const tr = new Konva.Transformer({
        nodes: [objDraw],
        anchorDragBoundFunc: function (oldPos, newPos, event) {

            // oldPos - is old absolute position of the anchor
            // newPos - is a new (possible) absolute position of the anchor based on pointer position
            // it is possible that anchor will have a different absolute position after this function
            // because every anchor has its own limits on position, based on resizing logic

            // do not snap rotating point
            if (tr.getActiveAnchor() === 'rotater') {
                return newPos;

            }

            const dist = Math.sqrt(
                Math.pow(newPos.x - oldPos.x, 2) + Math.pow(newPos.y - oldPos.y, 2)
            );

            return newPos;
        },
    });

    layers[currentStage].add(tr);

    sendRequest(shapesCanvas1, shapesCanvas2, mode);
}

/**
 * Add Event Listeners to both drawing canvases
 * index = 1 -> stage 1 (second stage)
 * index = 3 -> stage 3 (fourth stage)
 * **/

// stage 1
stages[index].on('mousedown', mouseDownHandler)
stages[index].on('mousemove', mouseMoveHandler)
stages[index].on('mouseup', mouseUpHandler)

// stage 3
stages[index + 2].on('mousedown', mouseDownHandler)
stages[index + 2].on('mousemove', mouseMoveHandler)
stages[index + 2].on('mouseup', mouseUpHandler)


/**
 * Function that checks if the mouse position is on one of our drawn shapes
 * @param x_current -> Current Mouse X Position
 * @param y_current -> Current Mouse Y Position
 * @returns {boolean} -> (true if the mouse is not on one of our drawn shapes)
 * Description: This function checks if the mouse position is on one of our drawn shapes by checking the position of
 * the mouse against the position of the shapes array. If the mouse is on one of our drawn shapes then we return false,
 **/
const checkDraw = (x_current, y_current) => {
    // check if the mouse position is on one of our drawn shapes
    for (let i = 0; i < operatingShapes.length; i++) {

        console.log(shapesCanvas1)

        if (operatingShapes[i].className === 'Rect') {
            console.log('ana hena 2')
            if (operatingShapes[i].x() <= x_current &&
                operatingShapes[i].x() + operatingShapes[i].width() > x_current &&
                operatingShapes[i].y() <= y_current &&
                operatingShapes[i].y() + operatingShapes[i].height() > y_current) {

                return false;                 // then I want to move the shape not to draw
            }
        }
        else if (operatingShapes[i].className === 'Ellipse') {
            console.log('ana hena 3')
            let rx = operatingShapes[i].radiusX(),
                ry = operatingShapes[i].radiusY(),
                xCenter = operatingShapes[i].x(),
                yCenter = operatingShapes[i].y();

            if (x_current >= xCenter - rx &&
                x_current < xCenter + rx &&
                y_current >= yCenter - ry &&
                y_current < yCenter + ry) {

                return false;
            }
        }
    }
    return true;                          // then I want to draw
}


/**
 * Function to detect which canvas the user is drawing on
 * @param event
 * @returns {number} -> index of the stage
 * Description: the function checks the event object where it handles drawing on empty canvas and on image
 * first, try if there is a parent to the event (parent to image is our canvas)
 * if no errors then a picture exists then select by parent id
 * if there's error and there is no parent (null) the catch will operate, and then we will use the canvas id itself
 **/
const detectCanvas = (event) => {
    try {
        let id = event.target.parent._id;

        if (id === 7)
            return 1;
        else if (id === 9)
            return 3;
    } catch (e) {
        if (event.target._id === 2)
            return 1;
        else
            return 3;
    }
}


/**
 * Function to draw a rectangle on the canvas
 * @param rectX
 * @param rectY
 * @param rectWidth
 * @param rectHeight
 * @param rectFill
 * @param rectDraggable
 * @param rectOpacity
 * @returns {Konva.Rect}
 **/
const drawRectangle = (
    rectX,
    rectY,
    rectWidth = 0,
    rectHeight = 0,
    rectFill = 'red',
    rectDraggable = true,
    rectOpacity = 0.5
) => {
    return new Konva.Rect({
        x: rectX,
        y: rectY,
        width: rectWidth,
        height: rectHeight,
        fill: rectFill,
        draggable: rectDraggable,
        opacity: rectOpacity,
    });
}

/**
 * Function to draw a circle on the canvas
 * @param circX
 * @param circY
 * @param circRadiusX
 * @param circRadiusY
 * @param circFill
 * @param circDraggable
 * @param circOpacity
 * @returns {Konva.Ellipse}
 **/
const drawEllipse = (
    circX,
    circY,
    circRadiusX = 0,
    circRadiusY = 0,
    circFill = 'red',
    circDraggable = true,
    circOpacity = 0.5
) => {
    return new Konva.Ellipse({
        x: circX,
        y: circY,
        radiusX: circRadiusX,
        radiusY: circRadiusY,
        fill: circFill,
        draggable: circDraggable,
        opacity: circOpacity,
    });
}

/**
 * Function to draw Image on the canvas
 * @param imgObj
 * @param imgX
 * @param imgY
 * @param imgWidth
 * @param imgHeight
 * @returns {Konva.Image}
 **/
const drawImage = (
    imgObj,
    imgX = 0,
    imgY = 0,
    imgWidth = drawingDivWidth,
    imgHeight = drawingDivHeight
) => {
    return new Konva.Image({
        x: imgX,
        y: imgY,
        image: imgObj,
        width: imgWidth,
        height: imgHeight,
    });
}


/**
 * Function to send the request to the server
 * @returns {Promise<void>}
 */
const sendRequest = __ => {

    // if ((canvasPreviewMode1 && !canvasPreviewMode2) || (!canvasPreviewMode1 && canvasPreviewMode2)) {
        fetch('http://127.0.0.1:7000/phasemixer/test', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            dataType: 'json',
            body: JSON.stringify({
                    mode: mode,
                    phase: check1.checked ? 'Canvas1': 'Canvas2',
                    canvasOneShapes: shapesCanvas1,
                    canvasTwoShapes: shapesCanvas2,
                }
            )
        });
    // }
}