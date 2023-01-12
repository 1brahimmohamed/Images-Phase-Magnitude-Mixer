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
let imageOriginalOne = new Image(),
    imageOriginalTwo = new Image(),
    imageOneMagPhase = new Image(),
    imageTwoMagPhase = new Image(),
    imgMag1 = new Image(),
    imgMag2 = new Image();


// DOM Elements Variables
let check1 = document.getElementById('check1'),
    check2 = document.getElementById('check2');

// Path Variables
let image1Path = '../static/images/image1.jpg',
    image2Path = '../static/images/image2.jpg',
    image1MagnitudePath = '../static/images/mag1.jpg',
    image2MagnitudePath = '../static/images/mag2.jpg',
    image1PhasePath = '../static/images/phase1.jpg',
    image2PhasePath = '../static/images/phase2.jpg';


/**  ---------------------------------------------- Event Listeners ---------------------------------------------- **/

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

                let selectedImage,
                    magImage,
                    originalPos,
                    magPos;

                // if the image is the first image toggle the first canvas
                // else toggle the second canvas
                if (evt.target.id === 'selectedFile') {
                    imageOriginalOne.src = image1Path;
                    check1.checked ? imageOneMagPhase.src = image1PhasePath:imageOneMagPhase.src = image1MagnitudePath;
                    selectedImage = imageOriginalOne;
                    magImage = imageOneMagPhase;
                    originalPos = 0;
                    magPos = 1;

                    // add image to canvas 1 (original image 1)
                    let img = drawImage(selectedImage);
                    layers[originalPos].add(img);

                    // add image to canvas 2 (phase/magnitude image 1)
                    imgMag1 = drawImage(magImage);
                    layers[magPos].add(imgMag1);

                } else {
                    imageOriginalTwo.src = image2Path;
                    check1.checked ? imageTwoMagPhase.src = image2MagnitudePath: imageTwoMagPhase.src = image2PhasePath;;
                    selectedImage = imageOriginalTwo;
                    magImage = imageTwoMagPhase;
                    originalPos = 2;
                    magPos = 3;

                    // add image to canvas 3 (original image 2)
                    let img = drawImage(selectedImage);
                    layers[originalPos].add(img);

                    // add image to canvas 4 (phase/magnitude image 2)
                    imgMag2 = drawImage(magImage);
                    layers[magPos].add(imgMag2);
                }
            })
            .catch((err) => {
                console.log(err);
            })
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
            imgMag1.image(newImage1)
            imgMag2.image(newImage2)
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
            imgMag1.image(newImage1)
            imgMag2.image(newImage2)

            evt.target.id === 'check1' ? check2.checked = false : check1.checked = false

            if (canvas1Status !== canvasStates[2])
                canvas1Status = canvasStates[1];
            if (canvas2Status !== canvasStates[2])
                canvas2Status = canvasStates[0];
        }
        sendRequest()
    }
})


