import path from 'path';
// import ResizeImage from '../middleware/resizeImage';
import formatResponse from '../middleware/formatResponse';
import fs from 'fs-extra';
import {
    getDb,
    getPrimaryKey
} from '../db/connectDb';
import archiver from 'archiver';

const collectionImages = 'images';
const collectionFiles = 'files';

const regexCutExt = /\.[^.]{0,4}$/i;


class UploadMediaController {

    deleteImages = async (req, res, next) => {
        try {
            const formData = req.body;
            if (!{
                    ...formData
                }.hasOwnProperty('Ids') || parseInt(Object.keys({
                    ...formData
                }).length) !== 1) {
                const message = `Format Error: FormData with key Ids`;
                return res.status(400).send(formatResponse(null, message));
            }
            res.status(200).send({
                formData
            });
        } catch (error) {
            const message = `Network Error`
            res.status(500).send(formatResponse(error, message));
        }
    }

    uploadOneImage = async (req, res, next) => {
        try {
            if (!req.file) {
                res.status(400).send(formatResponse(null, 'No file found!'));
                return next(err);
            }
            // const image = fs.readFileSync(req.file.path);
            // const encode_image = image.toString('base64');
            const finalImg = {
                filename: req.file.originalname.replace(regexCutExt, '').replace(/\s/gm, '_'),
                contentType: req.file.mimetype,
                createAt: Date.now(),
                // image: Buffer.from(encode_image, 'base64'),
                path: req.file.path
            };
            return await getDb().collection(collectionImages).insertOne(finalImg, (err, result) => {
                if (err) {
                    const message = `Network Error`
                    res.status(500).send(formatResponse(null, message));
                    return next(err);
                }
                const message = `Upload Success!`;
                let {
                    contentType,
                    image,
                    ...y
                } = result.ops[0];
                res.status(200).send(formatResponse({
                    ...y
                }, message));
            })
        } catch (error) {
            const message = `Network Error`
            res.status(500).send(formatResponse(error, message));
        }
    }

    getImageById = async (req, res, next) => {
        try {
            const id = req.params.id;
            return await getDb().collection(collectionImages).findOne({
                _id: getPrimaryKey(id)
            }, async (err, result) => {
                if (err) {
                    res.status(500).send(formatResponse(null, 'Network Error!'));
                    return next(err);
                }
                if (!result) {
                    res.status(404).send(formatResponse(null, 'File Not Found!'));
                    return next(err);
                }
                const message = `Request Successfully`;
                let {
                    contentType,
                    image,
                    ...y
                } = result;
                res.status(200).send(formatResponse({
                    ...y
                }, message));
            })
        } catch (error) {
            res.status(500).send(formatResponse(null, 'Network Error!'));
        }
    }

    deleteImageById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const image = await getDb().collection(collectionImages).findOne({
                _id: getPrimaryKey(id)
            });
            await fs.remove(image.path, (err) => {
                if (err) {
                    console.log(err, 'err roi');
                }
                console.log('Deleted File');
            });
            return await getDb().collection(collectionImages).findOneAndDelete({
                _id: getPrimaryKey(id)
            }, async (err, result) => {
                if (err) {
                    res.status(500).send(formatResponse(null, 'Network Error!'));
                    return next(err);
                }
                if (!result) {
                    res.status(404).send(formatResponse(null, 'File Not Found!'));
                    return next(err);
                }
                const message = `Delete Successfully`;
                res.status(200).send(formatResponse(null, message));
            })
        } catch (error) {
            res.status(500).send(formatResponse(null, 'File Not Found!'));
        }
    }

    downloadImageById = async (req, res, next) => {
        try {
            const id = req.params.id;
            return await getDb().collection(collectionImages).findOne({
                _id: getPrimaryKey(id)
            }, async (err, result) => {
                if (err) {
                    res.status(500).send(formatResponse(null, 'Network Error!'));
                    return next(err);
                }
                if (!result) {
                    res.status(404).send(formatResponse(null, 'File Not Found!'));
                    return next(err);
                }
                // res.contentType('image/jpeg');
                const filename = await `${result.filename}.${result.contentType.match(/([^\/]*)$/i)[0]}`;
                res.contentType(result.contentType);
                res.attachment(filename);
                res.status(200).send(result.image.buffer);
            })
        } catch (error) {
            res.status(500).send(formatResponse(null, 'Network Error!'));
        }
    }

    uploadMultiFiles = async (req, res, next) => {
        try {
            const files = req.files;
            const finalFiles = files.map(fileItem => ({
                filename: fileItem.originalname.replace(regexCutExt, '').replace(/\s/gm, '_'),
                contentType: fileItem.mimetype,
                createAt: Date.now(),
                path: fileItem.path
            }));
            return await getDb().collection(collectionFiles).insertMany(finalFiles, (err, result) => {
                if (err) {
                    return res.status(500).send(formatResponse(null, 'Network Error!'));
                }
                const response = result.ops.map(x => ({
                    filename: x.filename,
                    createAt: x.createAt,
                    path: x.path,
                    _id: x._id
                }));
                const message = `Upload Success!`;
                res.status(200).send(formatResponse(response, message));
            })


        } catch (error) {
            res.status(500).send(formatResponse(null, 'Network Error!'));
        }
    }
    downloadZipFiles = async (req, res, next) => {
        try {
            const formData = req.body;
            if (!{
                    ...formData
                }.hasOwnProperty('Ids') || parseInt(Object.keys({
                    ...formData
                }).length) !== 1) {
                const message = `Format Error: FormData with key Ids`;
                return res.status(400).send(formatResponse(null, message));
            }
            return await getDb().collection(collectionFiles).find({
                _id: {
                    $in: formData.Ids.map(x => getPrimaryKey(x))
                }
            }).toArray(async (err, data) => {
                if (err) {
                    return res.status(500).send(formatResponse(null, `Network Error!`));
                }
                const output = fs.createWriteStream('./uploads/downloadFiles.zip');
                const archive = archiver('zip', {
                    zlib: {
                        level: 9
                    }
                });
                archive.pipe(output);
                data.forEach(x => {
                    const fileItem = path.resolve(__dirname, `../../${x.path}`);
                    archive.append(fs.createReadStream(fileItem), {
                        name: `${x.filename}${x.path.match(regexCutExt)[0]}`
                    });
                });
                output.on('close', function () {
                    res.status(200).download(output.path);
                    // return next();
                });
                archive.finalize();
            })
        } catch (error) {
            res.status(500).send(formatResponse(null, 'Network Error!'));
        }
    }
}

export default new UploadMediaController();