import Joi from 'joi';

const validateSchema = async (input, schemaModel) => {
    return await Joi.validate(input, schemaModel, (err, res) => {
        if (err) {
            throw {
                message: err.details[0].message.replace(/['"]/g, '')
            }
        } else {
            return res
        }
    })
}
export default validateSchema