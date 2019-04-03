import jsonwebtoken from 'jsonwebtoken';
import 'dotenv';
class JWTToken {
    createJwt = (user) => {
        let expiry = new Date();
        expiry.setDate(expiry.getDate() + 7);
        return jsonwebtoken.sign({
                email: user.email,
                userName: user.userName,
                _id: user._id
            },
            process.env.SECRET_KEY, {
                expiresIn: parseInt(expiry.getTime() / 1000)
            });
    }
    verifyJWT = async (token) => {
        try {
            await jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
                if (err || !decodedToken) {
                    throw err
                } else {
                    return decodedToken
                }
            })
        } catch (error) {
            throw error
        }
    }
}
export default new JWTToken();