import sharp from 'sharp';
import uuidV4 from 'uuid/v4';
import path from 'path';

class ResizeImage {
    constructor(folder) {
        this.folder = folder;
    }
    static filename = () => {
        return `${uuidV4()}.png`;
    }
    filePath = (filename) => {
        return path.resolve(`${this.folder}/${filename}`)
    }
    save = async (buffer) => {
        console.log('ok');
        const filename = ResizeImage.filename();
        const filePath = this.filePath(filename);

        await sharp(buffer)
            .resize(300, 300, {
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(filePath);

        return filename;
    }


}

export default new ResizeImage();