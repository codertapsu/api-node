// import { Schema, model } from 'mongoose';

// const UserSchema = new Schema({
//     name: {
//         type: String,
//         require: true
//     },
//     desc: String
// }, {
//     timestamps: true
// })

// const User = model('User', UserSchema);

// export default User;

import Joi from 'joi';

const REGEX_EMAIL = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const UserModel = Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().regex(REGEX_EMAIL),
    userName: Joi.string().required(),
    password: Joi.string().required(),
    gender: [Joi.string(), Joi.number()],
    access_token: [Joi.string(), Joi.number()],
    createAt: Joi.date().default(Date.now()),
    updateAt: Joi.date().default(Date.now())
}).without('password', 'access_token')