/************************************************************************************
 *
 * File Name  : operations.js
 * Description: This file contains helper functions for the drawing & dragging operations
 * Author     : Ibrahim Mohamed
 *
 ************************************************************************************/



/**  ------------------------------------------------ Functions ------------------------------------------------ **/

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
        let offset = 5

        if (operatingShapes[i].className === 'Rect') {
            if (operatingShapes[i].x() - offset <= x_current &&
                operatingShapes[i].x() + operatingShapes[i].width() + offset > x_current &&
                operatingShapes[i].y() - offset <= y_current &&
                operatingShapes[i].y() + operatingShapes[i].height() + offset > y_current) {

                return false;
            }
        }
        else if (operatingShapes[i].className === 'Ellipse') {

            let rx = operatingShapes[i].radiusX(),
                ry = operatingShapes[i].radiusY(),
                xCenter = operatingShapes[i].x(),
                yCenter = operatingShapes[i].y();

            if (x_current >= xCenter - rx - offset &&
                x_current < xCenter + rx + offset &&
                y_current >= yCenter - ry - offset &&
                y_current < yCenter + ry + offset) {

                return false;
            }
        }
    }
    return true;
}


/**  ---------------------------------------------- Event Listeners ---------------------------------------------- **/


/**
 * Function which is executed when the user clicks on the canvas
 * @param event
 * @returns {void}
 **/
const mouseDownHandler = (event) => {


    // get the position of the mouse on click down
    let x_current = stages[currentStage].getPointerPosition().x,
        y_current = stages[currentStage].getPointerPosition().y;

    // choose which shapes array to store to
    if (currentStage === 1) {
        operatingShapes = shapesCanvas1;
    }
    else {
        operatingShapes = shapesCanvas2;
    }

    wantToDraw = checkDraw(x_current, y_current);

    if (!wantToDraw)
        return

    isDrawing = true;

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
 * @returns {void}
 **/
const mouseMoveHandler = (event) => {

    if (!wantToDraw)
        return;

    if (!isDrawing) {
        return;
    }

    if (circleDraw === false) {
        objDraw.width(stages[currentStage].getPointerPosition().x - objDraw.x());
        objDraw.height(stages[currentStage].getPointerPosition().y - objDraw.y());
        layers[currentStage].batchDraw();
    } else {
        objDraw.radiusX(Math.abs(stages[currentStage].getPointerPosition().x - objDraw.x()));
        objDraw.radiusY(Math.abs(stages[currentStage].getPointerPosition().y - objDraw.y()));
        layers[currentStage].batchDraw();
    }

    layers[currentStage].batchDraw()
}

/**
 * function which is executed when the user releases the mouse button
 * @param event
 * @returns {void}
 **/
const mouseUpHandler = (event) => {

    if (!wantToDraw) {
        sendRequest();
        wantToDraw = true;
        return;
    }

    if (!isDrawing) {
        return;
    }

    // to normalize the inputs if the user draw it backward
    if (objDraw.width() < 0 && objDraw.height() < 0) {
        objDraw.x(objDraw.x() + objDraw.width())
        objDraw.y(objDraw.y() + objDraw.height())
        objDraw.width(Math.abs(objDraw.width()))
        objDraw.height(Math.abs(objDraw.height()))
    } else if (objDraw.width() < 0) {
        objDraw.x(objDraw.x() + objDraw.width())
        objDraw.width(Math.abs(objDraw.width()))
    }


    isDrawing = false;        // disable drawing


    console.log('7atet shape')
    // push the shape to the array of shape of its canvas
    currentStage === 1 ? operatingShapes = shapesCanvas1.push(objDraw) : shapesCanvas2.push(objDraw);

    const tr = new Konva.Transformer({
        nodes: [objDraw],
        // anchorDragBoundFunc: function (oldPos, newPos, event) {
        //
        //     // oldPos - is old absolute position of the anchor
        //     // newPos - is a new (possible) absolute position of the anchor based on pointer position
        //     // it is possible that anchor will have a different absolute position after this function
        //     // because every anchor has its own limits on position, based on resizing logic
        //
        //     // do not snap rotating point
        //     if (tr.getActiveAnchor() === 'rotater') {
        //         return newPos;
        //
        //     }
        //     return newPos;
        // },
    });
    layers[currentStage].add(tr);

    sendRequest();
}

