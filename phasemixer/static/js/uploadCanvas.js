let imageOriginalOne = new Image(),
    imageOriginalTwo = new Image(),
    imageMagOne = new Image(),
    imageMagTwo = new Image(),
    imgMag1 = new Image(),
    imgMag2 = new Image();

// upload handling
document.addEventListener('input', (evt) => {
    if (evt.target.matches('.upload-class')) {
        let file = evt.target.files[0],
            formData = new FormData();

        formData.append('file', file);
        formData.append('location', evt.target.id === 'selectedFile' ? 'image1' : 'image2');

        axios.post('http://127.0.0.1:8000/phasemixer/upload', formData)
            .then((response) => {
                console.log(response.data.Status);

                let selectedImage,
                    magImage,
                    originalPos,
                    magPos;

                if (evt.target.id === 'selectedFile') {
                    imageOriginalOne.src = '../static/images/image1.png';
                    imageMagOne.src = '../static/images/mag1.png';
                    selectedImage = imageOriginalOne;
                    magImage = imageMagOne;
                    originalPos = 0;
                    magPos = 1;


                    let img = new Konva.Image({
                        x: 0,
                        y: 0,
                        image: selectedImage,
                        width: drawingDivWidth,
                        height: drawingDivHeight,
                    });

                    layers[originalPos].add(img);

                    imgMag1 = new Konva.Image({
                        x: 0,
                        y: 0,
                        image: magImage,
                        width: drawingDivWidth,
                        height: drawingDivHeight,
                    });

                    layers[magPos].add(imgMag1);

                } else {
                    imageOriginalTwo.src = '../static/images/image2.png';
                    imageMagTwo.src = '../static/images/mag2.png';
                    selectedImage = imageOriginalTwo;
                    magImage = imageMagTwo;
                    originalPos = 2;
                    magPos = 3;

                    imgMag2 = new Konva.Image({
                        x: 0,
                        y: 0,
                        image: magImage,
                        width: drawingDivWidth,
                        height: drawingDivHeight,
                    });

                    layers[magPos].add(imgMag2);

                    let img = new Konva.Image({
                        x: 0,
                        y: 0,
                        image: selectedImage,
                        width: drawingDivWidth,
                        height: drawingDivHeight,
                    });

                    layers[originalPos].add(img);

                }
            })
            .catch((err) => {
                console.log(err);
            })
    }
})


// toggle drawn shape
document.addEventListener('click', (evt) => {
    if (evt.target.matches('.nav-item')){
        if (evt.target.querySelector('i').classList.contains('bx-circle'))
            circleDraw = true;
        else if (evt.target.querySelector('i').classList.contains('bx-rectangle'))
            circleDraw = false;
    }
})

// toggle the phase/magnitude preview
document.addEventListener("change", (evt)=>{
    if (evt.target.matches('.checkbox')){
        if (evt.target.checked) {
            let newImage = new Image();
            evt.target.id === 'check1' ? newImage.src = '../static/images/phase1.png' : newImage.src = '../static/images/phase2.png';
            evt.target.id === 'check1' ? imgMag1.image(newImage) : imgMag2.image(newImage);
        }
        else if (!evt.target.checked) {
            let newImage = new Image();
            evt.target.id === 'check1' ? newImage.src = '../static/images/mag1.png' : newImage.src = '../static/images/mag2.png';
            evt.target.id === 'check1' ? imgMag1.image(newImage) : imgMag2.image(newImage);
        }
    }
})