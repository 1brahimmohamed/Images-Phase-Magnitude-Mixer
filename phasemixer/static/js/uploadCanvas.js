/******************************************************************************
 *
 * File Name  : uploadCanvas.js
 * Description: This file handles:
 *              1- the upload of photos from local computer to the frontend &
 *              to server and preview them in the canvas.
 *              2- toggling between the phase & magnitude images on the canvas
 * Author     : Ibrahim Mohamed
 *
 *******************************************************************************/


/**  ------------------------------------------ Variables Declarations ------------------------------------------ **/

// Image Objects Variables
// let imageOriginalOne = new Image(),
//     imageOriginalTwo = new Image(),
//     imageOneMagPhase = new Image(),
//     imageTwoMagPhase = new Image(),
   let selectionCanvas1Image = new Image(),
    selectionCanvas2Image = new Image(),
    previewCanvas1Image  = new Image(),
    previewCanvas2Image = new Image();


// DOM Elements Variables
let check1 = document.getElementById('check1'),
    check2 = document.getElementById('check2');

// Path Variables
let image1Path = '../static/images/image1.jpg',
    image2Path = '../static/images/image2.jpg',
    image1MagnitudePath = '../static/images/mag1.jpg',
    image2MagnitudePath = '../static/images/mag2.jpg',
    image1PhasePath = '../static/images/phase1.jpg',
    image2PhasePath = '../static/images/phase2.jpg',
    image1PreviewPath = '../static/images/preview1.jpg';


/**  ---------------------------------------------- Event Listeners ---------------------------------------------- **/


// startup function
const startUp = () => {
    let canvasStartUpImage = new Image();

    canvasStartUpImage.src = image1PreviewPath;

    selectionCanvas1Image = drawImage(canvasStartUpImage)
    selectionCanvas2Image = drawImage(canvasStartUpImage)
    previewCanvas1Image   = drawImage(canvasStartUpImage)
    previewCanvas2Image   = drawImage(canvasStartUpImage)

    layers[0].add(previewCanvas1Image);
    layers[1].add(selectionCanvas1Image);
    layers[2].add(previewCanvas2Image);
    layers[3].add(selectionCanvas2Image);
};

startUp();

// upload handling
document.addEventListener('input', (evt) => {

    if (evt.target.matches('.upload-class')) {
        let file = evt.target.files[0],         // get the file from the element
            formData = new FormData();

        formData.append('file', file);

        // select when to save the file to the server
        formData.append('location', evt.target.id === 'selectedFile' ? 'image1' : 'image2');

        axios.post('http://127.0.0.1:7000/phasemixer/upload', formData)
            .then((response) => {


                // if the image is the first image toggle the first canvas
                // else toggle the second canvas
                if (evt.target.id === 'selectedFile') {

                    let image = new Image();
                    image.src = image1Path
                    let imageMagPhase = new Image()
                    check1.checked ? imageMagPhase.src = image1PhasePath : imageMagPhase.src = image1MagnitudePath;

                    previewCanvas1Image.image(image);
                    // add image to canvas 2 (phase/magnitude image 1)
                    selectionCanvas1Image.image(imageMagPhase);

                } else {
                    let image = new Image();
                    image.src = image2Path;
                    let imageMagPhase = new Image()
                    check1.checked ? imageMagPhase.src = image2MagnitudePath: imageMagPhase.src = image2PhasePath;

                    // update image to canvas 3 (original image 2)
                    previewCanvas2Image.image(image);

                    // update image to canvas 4 (phase/magnitude image 2)
                    selectionCanvas2Image.image(imageMagPhase);
                }
            })
            .catch((err) => {
                console.log(err);
            })

        sendRequest()
    }
})


// toggle the phase/magnitude preview
document.addEventListener("change", (evt)=>{

    // if the target element is the checkbox
    if (evt.target.matches('.checkbox')){
        // if the checkbox is checked toggle the phase/magnitude preview
        if (evt.target.checked) {
            let newImage1 = new Image(),
                newImage2 = new Image();

            newImage1.src = image1PhasePath                 // canvas 2 is viewing the phase image
            newImage2.src = image2MagnitudePath             // canvas 4 is viewing the magnitude image
            selectionCanvas1Image.image(newImage1)
            selectionCanvas2Image.image(newImage2)
            evt.target.id === 'check1' ? check2.checked = true : check1.checked = true

            if (canvas1Status !== canvasStates[2])
                canvas1Status = canvasStates[0];
            if (canvas2Status !== canvasStates[2])
                canvas2Status = canvasStates[1];
        }
        else if (!evt.target.checked) {
            let newImage1 = new Image(),
                newImage2 = new Image();

            newImage1.src = image1MagnitudePath
            newImage2.src = image2PhasePath
            selectionCanvas1Image.image(newImage1)
            selectionCanvas2Image.image(newImage2)

            evt.target.id === 'check1' ? check2.checked = false : check1.checked = false

            if (canvas1Status !== canvasStates[2])
                canvas1Status = canvasStates[1];
            if (canvas2Status !== canvasStates[2])
                canvas2Status = canvasStates[0];
        }
        sendRequest()
    }
})


