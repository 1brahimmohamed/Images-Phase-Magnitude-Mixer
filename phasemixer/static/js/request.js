/******************************************************************************
 *
 * File Name  : request.js
 * Description: This file contains the functions to send the request to the
 *              server and set up the data for sending the request
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/


/**
 * Function to set up shapes objects
 * @param shapesArray Konva shapes array to be converted to JS Objects
 * returns {Array} shapes
 **/
const setUpRequestData = (shapesArray) => {

    let shapes = [],
        shape = null;

    for (let i = 0; i < shapesArray.length; i++) {

        if (shapesArray[i].className === 'Rect') {
            shape = {
                'attrs': {
                    x: shapesArray[i].x(),
                    y: shapesArray[i].y(),
                    width: shapesArray[i].width() * shapesArray[i].scaleX(),
                    height: shapesArray[i].height() * shapesArray[i].scaleY()
                },
                'className': 'Rect'
            }
        }
        else {
            shape = {
                'attrs': {
                    x: shapesArray[i].x(),
                    y: shapesArray[i].y(),
                    radiusX: shapesArray[i].radiusX() * shapesArray[i].scaleX(),
                    radiusY: shapesArray[i].radiusY() * shapesArray[i].scaleY()
                },
                'className': 'Ellipse'
            }
        }
        shapes.push(shape);
    }

    return shapes;
}

/**
 * Function to send the request to the server
 * @returns {void}
 */
const sendRequest = () => {

    let shapes1 = setUpRequestData(shapesCanvas1),
        shapes2 = setUpRequestData(shapesCanvas2);

    fetch('http://127.0.0.1:7000/phasemixer/generate-result', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        dataType: 'json',
        body: JSON.stringify({
                mode: mode,
                canvasOneState: canvas1Status,
                canvasTwoState: canvas2Status,
                canvasOneShapes: shapes1,
                canvasTwoShapes: shapes2,
            }
        )
    }).then(response => {
        let image = new Image();
        image.src = '../static/images/result.jpg';
        let img = drawImage(image);
        layers[4].add(img);
    })
}