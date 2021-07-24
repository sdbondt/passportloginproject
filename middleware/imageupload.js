const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if(isPhoto){
           next(null, true) 
        }else{
            next({message: "That filetype isn't allowed"}, false)
        }
    }
};

exports.upload = multer(multerOptions).single('image');

exports.resize = async(req, res, next) => {
    if(!req.file){
        return next()
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    photo.write(`./public/uploads/${req.body.photo}`);
    next()
}