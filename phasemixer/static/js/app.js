let objDraw = null,                     // object to be drawn
    isDrawing = false,                  // boolean to know if i am drawing
    drawCircle = false,                 // boolean to toggle drawing shape (rectangle/cicle)
    shapes = [],                        // array of drawn shapes
    stages = [],                        // array of stages
    layers = [];                        // array of layers[0]s

let originalImageOne = document.getElementById('konva-container-1'),
    drawingDivWidth = originalImageOne.offsetWidth,
    drawingDivHeight = originalImageOne.offsetHeight;

let index = 1;
let wantToDraw = true;

for (let i = 1; i < 6; i++) {
    const Stage = new Konva.Stage({
        height: drawingDivHeight,
        width: drawingDivWidth,
        container: `konva-container-${i}`,
    });
    stages.push(Stage)
}
for (let i = 0; i < 5; i++) {
    const layer = new Konva.Layer();
    layers.push(layer);
    stages[i].add(layer);
}

const xSnaps = Math.round(stages[index].width() / 100);
const ySnaps = Math.round(stages[index].height() / 100);
const cellWidth = stages[0].width() / xSnaps;
const cellHeight = stages[0].height() / ySnaps;


// let imageObj = new Image();
// imageObj.src = '../static/images/img.png';

// imageObj.onload = function () {
//     let yoda = new Konva.Image({
//         x: 0,
//         y: 0,
//         image: imageObj,
//         width: stages[index].width(),
//         height: stages[index].height(),
//     });
//
//     // add the shape to the layers[0]
//     layers[0].add(yoda);
// };

let mouseDownHandler = (event) => {

    if (!wantToDraw)
        return;

    isDrawing = true;


    if (drawCircle === false) {
        objDraw = new Konva.Rect({
            x: stages[index].getPointerPosition().x,
            y: stages[index].getPointerPosition().y,
            width: 0,
            height: 0,
            fill: 'red',
            draggable: true,
            opacity: 0.5,

        });
    } else {
        objDraw = new Konva.Circle({
            x: stages[index].getPointerPosition().x,
            y: stages[index].getPointerPosition().y,
            radiusX: 100,
            radiusY: 50,
            fill: 'red',
            draggable: true,
            opacity: 0.5,
        });
    }

    layers[index].add(objDraw).batchDraw();
}

let mouseMoveHandler = (event) => {

    if(!wantToDraw)
        return;

    if (!isDrawing) {
        return false;
    }

    if (drawCircle === false) {
        objDraw.width(stages[index].getPointerPosition().x - objDraw.x());
        objDraw.height(stages[index].getPointerPosition().y - objDraw.y());
        layers[0].batchDraw();
    } else {
        rise = Math.pow(stages[index].getPointerPosition().y - objDraw.y(), 2);
        run = Math.pow(stages[index].getPointerPosition().x - objDraw.x(), 2);
        const newRaduis = Math.sqrt(rise + run);
        objDraw.radius(newRaduis);
    }

    layers[index].batchDraw()
}

let mouseUpHandler = (event) => {


    if(!wantToDraw) {
        console.log(`
            'x: ' + ${shapes[index].x()},
            'y: ' + ${shapes[index].y()},
            'rotation: ' + ${shapes[index].rotation()},
            'width: ' + ${(shapes[index].width() * shapes[0].scaleX())},
            'height: ' + ${shapes[index].height() * shapes[0].scaleY()},
            'scaleX: ' + ${shapes[index].scaleX()},
            'scaleY: ' + ${shapes[index].scaleY()},
            `)
        return
    }

    isDrawing = false;
    shapes.push(objDraw);
    // console.log(`
    //         'x: ' + ${shapes[0].x()},
    //         'y: ' + ${shapes[0].y()},
    //         'rotation: ' + ${shapes[0].rotation()},
    //         'width: ' + ${(shapes[0].width() * shapes[0].scaleX())},
    //         'height: ' + ${shapes[0].height() * shapes[0].scaleY()},
    //         'scaleX: ' + ${shapes[0].scaleX()},
    //         'scaleY: ' + ${shapes[0].scaleY()},
    //         `)
    const tr = new Konva.Transformer({
        nodes: [objDraw],
        anchorDragBoundFunc: function (oldPos, newPos, event) {

            // log(`x: ${objDraw.attrs.x}`, `y: ${objDraw.attrs.y}`);
            // log(`w: ${objDraw.attrs.width}`, `l: ${objDraw.attrs.height}`);

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

            // do not do any snapping with new absolute position (pointer position)
            // is too far away from old position
            if (dist > 10) {
                return newPos;
            }

            const closestX = Math.round(newPos.x / cellWidth) * cellWidth;
            const diffX = Math.abs(newPos.x - closestX);

            const closestY = Math.round(newPos.y / cellHeight) * cellHeight;
            const diffY = Math.abs(newPos.y - closestY);

            const snappedX = diffX < 10;
            const snappedY = diffY < 10;

            // a bit different snap strategies based on snap direction
            // we need to reuse old position for better UX
            if (snappedX && !snappedY) {
                return {
                    x: closestX,
                    y: oldPos.y,
                };
            } else if (snappedY && !snappedX) {
                return {
                    x: oldPos.x,
                    y: closestY,
                };
            } else if (snappedX && snappedY) {

                return {
                    x: closestX,
                    y: closestY,
                };
            }
            return newPos;
        },
    });

    layers[index].add(tr);


}

stages[index].on('mousedown', mouseDownHandler)
stages[index].on('mousemove', mouseMoveHandler)
stages[index].on('mouseup', mouseUpHandler)


