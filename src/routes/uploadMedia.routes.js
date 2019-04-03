import UploadMediaController from '../controller/uploadMedia.controller';
import HandleFormData from '../middleware/HandleFormData'

const UploadMediaRoutes = (router) => {
    // Images
    router.route('/media/image')
        .post(
            (req, res, next) => HandleFormData.handleErr(req, res, next, HandleFormData.uploadFile('images').single('image')),
            UploadMediaController.uploadOneImage)
        .delete(HandleFormData.getFields(), UploadMediaController.deleteImages);
    router.route('/media/image/:id')
        .get(UploadMediaController.getImageById)
        .delete(UploadMediaController.deleteImageById);
    router.route('/media/image/download/:id')
        .get(UploadMediaController.downloadImageById);

    // Videos

    // Files
    router.route('/media/file')
        .post(
            (req, res, next) => HandleFormData.handleErr(req, res, next, HandleFormData.uploadFile('files').array('file', 20)),
            UploadMediaController.uploadMultiFiles);
            router.route('/media/file/download')
            .get(HandleFormData.getFields(), UploadMediaController.downloadZipFiles, () => {
                console.log('aaa')
            })
}

export default UploadMediaRoutes;