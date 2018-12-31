const clickListner = (e) => {
    const imgSource = e.target.src;
    const imageName = imgSource.substring(imgSource.lastIndexOf("/"), imgSource.length);
    const fullSrc = 'images/' + imageName.substring(0, imageName.length - 10);
    if (imgSource) {
        const overlay = document.querySelector('.Overlay');
        overlay.classList.remove('is-hidden');

        const image = overlay.getElementsByClassName('Overlay-image')[0];
        image.src = fullSrc;
    }
};

// Apply listener to all tiles
const tiles = document.getElementsByClassName('PhotoGrid-tile');

for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', clickListner, false);
}

const disableOverlay = () => {
    document.getElementsByClassName('Overlay')[0].classList.add('is-hidden');
};

document.getElementsByClassName('Overlay-x')[0].addEventListener('click', disableOverlay);
document.getElementsByClassName('Overlay')[0].addEventListener('click', e => {
    if (e.target == document.querySelector('.Overlay')) {
        disableOverlay();
    }
});

window.addEventListener('keydown', function(e) {
    if (e.key == 'Escape') {
        disableOverlay();
    }
});

document.querySelector('.NavButtons-button--previous').addEventListener('click', function(e) {
    if (!e.target.classList.contains('is-disabled')) {
        const urlParams = new URLSearchParams(window.location.search);
        const pageNum = urlParams.get('page') || 1;
        if (!(pageNum <= 1)) {
            window.location.href = "/?page=" + (parseInt(pageNum) - 1);
        }
    }
});

document.querySelector('.NavButtons-button--next').addEventListener('click', function(e) {
    if (!e.target.classList.contains('is-disabled')) {
        const urlParams = new URLSearchParams(window.location.search);
        const pageNum = urlParams.get('page') || 1;
        window.location.href = "/?page=" + (parseInt(pageNum) + 1);
    }
});
