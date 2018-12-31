const express = require('express');
const multer  = require('multer');
const fs = require('fs');
const Jimp = require('jimp');
const path = require('path');


module.exports = function() {
    const upload = multer({
        storage: multer.diskStorage({
            destination: 'photos/uploaded',
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.parse(file.originalname).ext);
            }
        })
    });
    const app = express();

    app.use('/assets', express.static('frontend/assets'));
    app.use('/images', express.static('photos/uploaded'));
    app.use('/thumbs', express.static('photos/thumbs'));

    const pageSize = 9;

    app.set('view engine', 'ejs');
    app.set('views', path.resolve('frontend/views'));

    let fileList = fs.readdirSync(path.resolve('photos/thumbs')).reverse();

    app.get('/', (req, res) => {
        let page = req.query.page || 1;
        let startIndex = (page - 1) * pageSize;
        let endIndex = startIndex + pageSize;
        let photos = fileList.slice(startIndex, endIndex);
        let nextDisabled = endIndex >= fileList.length ? true : false;
        let previousDisabled = startIndex == 0 ? true : false;
        if (photos.length > 0) {
            res.render('index', { photos, previousDisabled, nextDisabled });
        } else if (fileList.length > 0) {
            res.redirect('/?page=1');
        }
    });

    app.post('/upload', upload.single('photo'), function (req, res, next) {
        console.log(`${process.pid} recieved`);
        Jimp.read(req.file.path)
            .then(image => {
                return image
                .cover(256, 256, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE)
                .quality(60)
                .write(path.resolve('photos/thumbs', req.file.filename + '.thumb.jpg'), function() {
                    fs.readdir(path.resolve('photos/thumbs'), function(err, files) {
                        fileList = files.reverse();
                    });
                    console.log(`${process.pid} written, all done`);
                });
            })
            .catch(err => {
                console.error(err);
            });
        console.log(`${process.pid} exiting handler`);
        res.sendStatus(200);
    });

    app.listen(80, '0.0.0.0', () => console.log(`${process.pid} listening on port 80`));
}
