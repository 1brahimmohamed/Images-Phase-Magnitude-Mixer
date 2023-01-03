const navItemsUp = document.querySelectorAll('.navi');
const navItemsDown = document.querySelectorAll('.navo');


let uniCanvas1 = false;
let uniCanvas2 = false;

navItemsUp.forEach(navItemUpper => {
    navItemUpper.addEventListener('click', () => {
        navItemsUp.forEach(navItem => {
            navItem.classList.remove('active');
        });

        navItemUpper.classList.add('active');
    });

});

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

        // check if it is the circle button
        if (evt.target.classList.contains('bx-circle'))
            circleDraw = true;
        // check if it is the square button
        else if (evt.target.classList.contains('bx-rectangle'))
            circleDraw = false;

        if (evt.target.classList.contains('bx-merge'))
            mode = modes[0]
        else if (evt.target.classList.contains('bx-intersect'))
            mode = modes[1]
        else if (evt.target.classList.contains('bx-minus-front'))
            mode = modes[2]

        console.log(mode)
    }
})


document.addEventListener('click', (evt) => {
    if (evt.target.matches('.disable')){
        if (evt.target.id === 'disable1') {
            uniCanvas1 = !uniCanvas1;
            if (uniCanvas1) {
                drawDisableImage(0);
                canvas1Status = canvasStatus[2];
            }
            else {
                deleteDisableImage(0);

                if (check1.checked)
                    canvas1Status = canvasStatus[0];
                else
                    canvas1Status = canvasStatus[1];
            }
        }
        else if (evt.target.id === 'disable2') {
            uniCanvas2 = !uniCanvas2;
            if (uniCanvas2) {
                drawDisableImage(2);
                canvas2Status = canvasStatus[2];
            }
            else {
                deleteDisableImage(2);

                if (check2.checked)
                    canvas2Status = canvasStatus[1];
                else
                    canvas2Status = canvasStatus[0];
            }
        }
        console.log(canvas1Status, canvas2Status)
    }
})


const drawDisableImage = (layerNumber) => {
    let newImage = new Image()
    newImage.src = '../static/images/disable.png'
    let img = drawImage(newImage)
    layers[layerNumber].add(img)
}

const deleteDisableImage = (layerNumber) => {
    let layerImages = layers[layerNumber].find('Image')
    layerImages[1].remove()
}