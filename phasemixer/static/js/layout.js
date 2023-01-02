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