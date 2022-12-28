let objDraw = null;
let isDrawing = false;
let drawCic = false;

const log = console.log;
let wantToDraw = true;
let shapes = [];

const stage = new Konva.Stage({
    height: 500,
    width: 500,
    container: 'konva-holder',
});

const layer = new Konva.Layer();
stage.add(layer);


const xSnaps = Math.round(stage.width() / 100);
const ySnaps = Math.round(stage.height() / 100);
const cellWidth = stage.width() / xSnaps;
const cellHeight = stage.height() / ySnaps;


let imageObj = new Image();

imageObj.onload = function () {
    let yoda = new Konva.Image({
        x: 0,
        y: 0,
        image: imageObj,
        width: stage.width(),
        height: stage.height(),
    });

    // add the shape to the layer
    layer.add(yoda);
};
imageObj.src = '../static/images/img.png';

let mouseDownHandler = (event) => {

    if (!wantToDraw)
        return;

    isDrawing = true;


    if (drawCic === false) {
        objDraw = new Konva.Rect({
            x: stage.getPointerPosition().x,
            y: stage.getPointerPosition().y,
            width: 0,
            height: 0,
            fill: 'red',
            draggable: true,
            opacity: 0.5,

        });
    } else {
        objDraw = new Konva.Circle({
            x: stage.getPointerPosition().x,
            y: stage.getPointerPosition().y,
            radiusX: 100,
            radiusY: 50,
            fill: 'red',
            draggable: true,
            opacity: 0.5,
        });
    }

    layer.add(objDraw).batchDraw();
}

let mouseMoveHandler = (event) => {

    if(!wantToDraw)
        return;

    if (!isDrawing) {
        return false;
    }

    if (drawCic === false) {
        objDraw.width(stage.getPointerPosition().x - objDraw.x());
        objDraw.height(stage.getPointerPosition().y - objDraw.y());
        layer.batchDraw();
    } else {
        rise = Math.pow(stage.getPointerPosition().y - objDraw.y(), 2);
        run = Math.pow(stage.getPointerPosition().x - objDraw.x(), 2);
        const newRaduis = Math.sqrt(rise + run);
        objDraw.radius(newRaduis);
    }

    layer.batchDraw()
}

let mouseUpHandler = (event) => {


    if(!wantToDraw) {
        console.log(`
            'x: ' + ${shapes[0].x()},
            'y: ' + ${shapes[0].y()},
            'rotation: ' + ${shapes[0].rotation()},
            'width: ' + ${(shapes[0].width() * shapes[0].scaleX())},
            'height: ' + ${shapes[0].height() * shapes[0].scaleY()},
            'scaleX: ' + ${shapes[0].scaleX()},
            'scaleY: ' + ${shapes[0].scaleY()},
            `)
        return
    }

    isDrawing = false;
    shapes.push(objDraw);
    console.log(`
            'x: ' + ${shapes[0].x()},
            'y: ' + ${shapes[0].y()},
            'rotation: ' + ${shapes[0].rotation()},
            'width: ' + ${(shapes[0].width() * shapes[0].scaleX())},
            'height: ' + ${shapes[0].height() * shapes[0].scaleY()},
            'scaleX: ' + ${shapes[0].scaleX()},
            'scaleY: ' + ${shapes[0].scaleY()},
            `)
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

    layer.add(tr);


}

function updateText() {
    let lines = [
        'x: ' + objDraw.x(),
        'y: ' + objDraw.y(),
        'rotation: ' + objDraw.rotation(),
        'width: ' + (objDraw.width() * objDraw.scaleX()),
        'height: ' + objDraw.height() * objDraw.scaleY(),
        'scaleX: ' + objDraw.scaleX(),
        'scaleY: ' + objDraw.scaleY(),
    ];
    text.text(lines.join('\n'));
}

stage.on('mousedown', mouseDownHandler)
stage.on('mousemove', mouseMoveHandler)
stage.on('mouseup', mouseUpHandler)


