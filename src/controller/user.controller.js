import 'dotenv';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import {
    getDb,
    getPrimaryKey
} from '../db/connectDb';
import {
    UserModel
} from '../model/user.model';
import formatResponse from '../middleware/formatResponse';
import validateSchema from '../middleware/validateSchema';
import JWTToken from '../middleware/JWTToken';

const collection = 'users';

const saltRounds = 10;

class UserController {
    checkExistEmail = async (req, res) => {
        try {
            const body = req.body;
            const user = await getDb().collection(collection).findOne({
                email: body.email
            });
            if (user) {
                const result = {
                    isExist: true
                };
                return res.status(200).send(formatResponse(result, 'Email already exists.'))
            } else {
                const result = {
                    isExist: false
                };
                return res.status(200).send(formatResponse(result, 'Available'))
            }
        } catch (error) {
            return res.status(500).send(formatResponse(null, 'Network Error!'))
        }
    }
    checkExistUserName = async (req, res) => {
        try {
            const body = req.body;
            const user = await getDb().collection(collection).findOne({
                userName: body.userName
            });
            if (user) {
                const result = {
                    isExist: true
                };
                return res.status(200).send(formatResponse(result, 'UserName already exists.'))
            } else {
                const result = {
                    isExist: false
                };
                return res.status(200).send(formatResponse(result, 'Available'))
            }
        } catch (error) {
            return res.status(500).send(formatResponse(null, 'Network Error!'))
        }
    }

    login = async (req, res) => {
        try {
            const body = req.body;
            const user = await getDb().collection(collection).findOne({
                $or: [{
                    userName: body.userName
                }, {
                    email: body.userName
                }]
            });
            const match = await bcrypt.compare(body.password, user.password);
            if (!match) {
                const message = `Unauthorized Access. Invalid Password`;
                return res.status(401).send(formatResponse(null, message));
            }
            if (match) {
                const message = `Welcome! ${user.userName}`;
                return res.status(200).send(formatResponse({
                    token: JWTToken.createJwt(user)
                }, message));
            } else {
                const message = `Unauthorized Access.`;
                return res.status(401).send(formatResponse(null, message));
            }
        } catch (error) {
            const message = `Invalid UserName or Email`;
            res.status(404).send(formatResponse(null, message));
        }
    }

    create = async (req, res) => {
        try {
            const userInput = req.body;
            const validate = await validateSchema(userInput, UserModel);
            await bcrypt.hash(validate.password, saltRounds, async (err, hash) => {
                if (err) {
                    const message = `Network Error`
                    res.status(500).send(formatResponse(null, message));
                } else {
                    let saveData = validate;
                    saveData.password = hash;
                    return await getDb().collection(collection).insertOne(saveData, (err, result) => {
                        if (err) {
                            const message = `Network Error`
                            res.status(500).send(formatResponse(null, message));
                        } else {
                            const message = `Create Successfully`;
                            let x = {
                                ...result.ops[0]
                            };
                            let {
                                password,
                                ...y
                            } = x;
                            res.status(200).send(formatResponse({
                                ...y
                            }, message))
                        }
                    })
                }
            })
        } catch (error) {
            res.status(400).send(formatResponse(null, error.message))
        }
    }

    findAll = async (req, res) => {
        try {
            // let token = req.headers['x-access-token'] || req.headers['authorization'] || req.query.token || req.body.token;
            // console.log(token)
            // if(!token){
            //     return res.status(401).send(formatResponse(null, 'No Access Token'));
            // } else {
            //     jsonwebtoken.verify(token, process.env.SECRET_KEY, (err, decodedToken) => {
            //         if(err || !decodedToken){
            //             return res.status(403).send(formatResponse(null, 'Invalid Token'));
            //         } else {
            //             return res.status(200).send(formatResponse(null, 'Ho ho'));
            //         }
            //     })
            // }
            return await getDb().collection(collection).find({}).toArray((err, data) => {
                if (err) {
                    const message = `Network Error`
                    res.status(500).send(formatResponse(null, message));
                } else {
                    const message = 'Request Successfully';
                    res.status(200).send(formatResponse(data, message));
                }
            });
        } catch (error) {
            res.status(500).send(formatResponse(null, 'Network Error!'))
        }
    }

    findOne = async (req, res) => {
        try {
            const id = req.params.id;
            return await getDb().collection(collection).findOne({
                _id: getPrimaryKey(id)
            }, (err, data) => {
                if (err) {
                    res.status(500).send({
                        err
                    })
                } else {
                    const message = 'Request Successfully';
                    res.status(200).send(formatResponse(data, message));
                }
            })
        } catch (error) {
            res.status(404).send({
                error
            })
        }
    }

    // findOneAndUpdate = async (req, res) => {
    //     try {
    //         const id = req.params.id;
    //         const input = req.body;
    //         return await getDb().collection(collection).findOneAndUpdate({
    //             _id: getPrimaryKey(id)
    //         })
    //     } catch (error) {
    //         res.send({error})
    //     }
    // }
}

export default new UserController();