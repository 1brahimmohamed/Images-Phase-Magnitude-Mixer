/************************************************************************************
 *
 * File Name  : drawShapes.js
 * Description: This handles UI & layout logic of the application
 * Author     : Maye Khaled, Mariam Wael & Ibrahim Mohamed
 *
 ************************************************************************************/



/**  ------------------------------------------ Variables Declarations ------------------------------------------ **/

// DOM Elements Declarations
const navItemsUp = document.querySelectorAll('.navi');
const navItemsDown = document.querySelectorAll('.navo');

// Uniform Phase/Magnitude boolean variables
let uniCanvas1 = false;
let uniCanvas2 = false;


/**  ---------------------------------------------- Event Listeners ---------------------------------------------- **/

// Upper Side Bar
navItemsUp.forEach(navItemUpper => {

    navItemUpper.addEventListener('click', () => {
        navItemsUp.forEach(navItem => {
            navItem.classList.remove('active');
        });

        navItemUpper.classList.add('active');
    });

});

// Lower Side Bar
navItemsDown.forEach(navItemDown => {
    navItemDown.addEventListener('click', () => {
        navItemsDown.forEach(navItem => {
            navItem.classList.remove('active');
        });

        navItemDown.classList.add('active');
    });
});

// toggle drawn shape & modes
document.addEventListener('click', (evt) => {

    // if the target element is navigation element
    if (evt.target.matches('.nevo')){

        // ------------- Shape Selection ------------- //

        if (evt.target.classList.contains('bx-circle'))
            circleDraw = true;
        else if (evt.target.classList.contains('bx-rectangle'))
            circleDraw = false;

        // ------------- Mode Selection ------------- //

        if (evt.target.classList.contains('bx-merge'))
            mode = modes[0]
        else if (evt.target.classList.contains('bx-intersect'))
            mode = modes[1]
        else if (evt.target.classList.contains('bx-minus-front'))
            mode = modes[2]

        sendRequest()

    }
})

//  disable/enable the canvas
document.addEventListener('click', (evt) => {
    if (evt.target.matches('.disable')){

        // (canvas 1)
        if (evt.target.id === 'disable1') {
            uniCanvas1 = !uniCanvas1;                      // toggle the state
            if (uniCanvas1) {                              // if the state is true
                drawDisableImage(0);            // draw the-disable image
                canvas1Status = canvasStates[2];
            }
            else {
                deleteDisableImage(0);          // delete the disable image
                if (check1.checked)                        // if the checkbox is checked
                    canvas1Status = canvasStates[0];       // set the status to "Phase"
                else
                    canvas1Status = canvasStates[1];       // set the status to "Magnitude"
            }
        }

        // (canvas 2)
        else if (evt.target.id === 'disable2') {
            uniCanvas2 = !uniCanvas2;                       // toggle the state
            if (uniCanvas2) {
                drawDisableImage(2);             // draw the-disable image
                canvas2Status = canvasStates[2];            // set the status to "Disable"
            }
            else {
                deleteDisableImage(2);            // delete the disable image
                if (check2.checked)                         // if the checkbox is checked
                    canvas2Status = canvasStates[1];        // set the status to "Magnitude"
                else
                    canvas2Status = canvasStates[0];        // set the status to "Phase"
            }
        }

        sendRequest()
    }
})


/**  ------------------------------------------------ Functions ------------------------------------------------ **/

/**
 * Function to draw the-disable image on specific canvas
 * @param {number} layerNumber - the layer number to draw the image on
 * @return {void}
 **/
const drawDisableImage = (layerNumber) => {
    let newImage = new Image()
    newImage.src = '../static/images/disable.png'
    let img = drawImage(newImage)
    layers[layerNumber].add(img)
}


/**
 * Function to erase the-disable image on specific canvas
 * @param {number} layerNumber - the layer number to draw the image on
 * @return {void}
 **/
const deleteDisableImage = (layerNumber) => {
    let layerImages = layers[layerNumber].find('Image')
    layerImages[1].remove()
}