import formatResponse from '../middleware/formatResponse';
import JWTToken from './JWTToken';

const auth = async (req, res, next) => {
    try {
        let token = req.headers['x-access-token'] || req.headers['authorization'] || req.query.token || req.body.token;
        if(!token){
            const message = `Auth token is not supplied`;
            return res.status(403).send(formatResponse(null, message));
        } else {
            if (token.startsWith('Bearer ')) {
                token = token.slice(7, token.length);
              }
            await JWTToken.verifyJWT(token)
            .then(res => {
                next();
            })
            .catch(err => {
                throw error
            })
            
        }
    } catch (error) {
        const message = `Auth token is not supplied`;
        return res.status(403).send(formatResponse(null, message));
    }
}
export default auth