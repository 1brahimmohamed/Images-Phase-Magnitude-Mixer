const navItemsUp = document.querySelectorAll('.navi');
const navItemsDown = document.querySelectorAll('.navo');

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
        // if (evt.target.querySelector('i').classList.contains('bx-merge'))
        //     mode = modes[0]
        // else if (evt.target.querySelector('i').classList.contains('bx-intersect'))
        //     mode = modes[1]
        // else if (evt.target.querySelector('i').classList.contains('bx-minus-front'))
        //     mode = modes[2]

        console.log('hima')
    }
})