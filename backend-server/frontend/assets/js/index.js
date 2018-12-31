const canvas = document.getElementById('preview');
const context = canvas.getContext('2d');

let image = new Image();
image.src = '/preview/' + Date.now();
const displayImage = () => {
    requestAnimationFrame(displayImage);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    try {
        image.src = '/preview/' + Date.now();
    }
    catch(error) {
        console.log('Could not load image', error);
    }
};

const setCanvasSize = () => {
    canvas.height = document.body.clientHeight;
    canvas.width = document.body.clientHeight * 1.5;
};

let timeout = false;
let delay = 250;

window.addEventListener('resize', function() {
    clearTimeout(timeout);
    timeout = setTimeout(setCanvasSize, delay);
});

setCanvasSize();
displayImage();
