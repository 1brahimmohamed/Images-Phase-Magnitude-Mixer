let imageOriginalOne = new Image(),
    imageOriginalTwo = new Image(),
    imageMagOne = new Image(),
    imageMagTwo = new Image(),
    imgMag1 = new Image(),
    imgMag2 = new Image(),
    canvasPreviewMode1 = true,
    canvasPreviewMode2 = true;

let check1 = document.getElementById('check1'),
    check2 = document.getElementById('check2');

// upload handling
document.addEventListener('input', (evt) => {

    // if the target element is input element
    if (evt.target.matches('.upload-class')) {
        let file = evt.target.files[0],         // get the file from the element
            formData = new FormData();          // create a new form data object

        // append the file to the form data object
        formData.append('file', file);

        // select when to save the file to the server
        formData.append('location', evt.target.id === 'selectedFile' ? 'image1' : 'image2');

        // send the server request
        axios.post('http://127.0.0.1:7000/phasemixer/upload', formData)
            .then((response) => {

                let selectedImage,
                    magImage,
                    originalPos,
                    magPos;

                // if the image is the first image toggle the first canvas
                // else toggle the second canvas
                if (evt.target.id === 'selectedFile') {
                    imageOriginalOne.src = '../static/images/image1.png';
                    imageMagOne.src = '../static/images/mag1.png';
                    selectedImage = imageOriginalOne;
                    magImage = imageMagOne;
                    originalPos = 0;
                    magPos = 1;

                    // add image to canvas 1 (original image 1)
                    let img = drawImage(selectedImage);
                    layers[originalPos].add(img);

                    // add image to canvas 2 (phase/magnitude image 1)
                    imgMag1 = drawImage(magImage);
                    layers[magPos].add(imgMag1);

                } else {
                    imageOriginalTwo.src = '../static/images/image2.png';
                    imageMagTwo.src = '../static/images/phase2.png';
                    selectedImage = imageOriginalTwo;
                    magImage = imageMagTwo;
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


            if (evt.target.id === 'check1'){
                newImage1.src = '../static/images/phase1.png'
                newImage2.src = '../static/images/mag2.png'
                imgMag1.image(newImage1)
                imgMag2.image(newImage2)
                canvasPreviewMode1 = false
                check2.checked = true
                console.log(check1.checked, check2.checked)

            } else {
                newImage1.src = '../static/images/phase1.png'
                newImage2.src = '../static/images/mag2.png'
                imgMag1.image(newImage1)
                imgMag2.image(newImage2)
                canvasPreviewMode2 = false
                check1.checked = true
                console.log(check1.checked, check2.checked)


            }
        }
        else if (!evt.target.checked) {
            let newImage1 = new Image(),
                newImage2 = new Image();

            if (evt.target.id === 'check1'){
                newImage1.src = '../static/images/mag1.png'
                newImage2.src = '../static/images/phase2.png'
                imgMag1.image(newImage1)
                imgMag2.image(newImage2)
                canvasPreviewMode1 = true
                check2.checked = false
            } else {
                newImage1.src = '../static/images/mag1.png'
                newImage2.src = '../static/images/phase2.png'
                imgMag1.image(newImage1)
                imgMag2.image(newImage2)
                canvasPreviewMode2 = true
                check1.checked = false
            }
        }
    }
})


