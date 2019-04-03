import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';
import formatResponse from './formatResponse';

const formData = multer();

class HandleFormData {

    handleErr = (req, res, next, method) => {
        method(req, res, err => {
            if (err instanceof multer.MulterError) {
                return res.status(400).send(formatResponse(err, 'Dto invalid'));
            }
            if (err) {
                return res.status(400).send(formatResponse(err, 'Invalid request'));
            } else {
                return next();
            }
        })
    }



    getFields = () => {
        return formData.fields([])
    }

    uploadFile = (folderName) => {
        const storage = (folderName) => {
            if (!fs.existsSync(path.resolve(__dirname, `../../uploads`)) || !fs.existsSync(path.resolve(__dirname, `../../uploads/${folderName}`))) {
                fs.mkdirSync(path.resolve(__dirname, `../../uploads/${folderName}`), {
                    recursive: true
                });
            }
            return multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, `uploads/${folderName}`)
                },
                filename: (req, file, cb) => {
                    cb(null, Date.now() + '__' + file.originalname.replace(/\s/gm, '_'))
                }
            });
        };
        return multer({
            storage: storage(folderName),
            limits: {
                fieldSize: 1024 * 1024 * 5
            }
        })
    }

}

export default new HandleFormData();