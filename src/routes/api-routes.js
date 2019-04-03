import {
    Router
} from 'express';
const router = Router();
router.get('/', (req, res) => {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTHub crafted with love!',
    });
});
import UserRoutes from './user.routes';
UserRoutes(router);
import UploadMediaRoutes from './uploadMedia.routes';
UploadMediaRoutes(router);

export default router;