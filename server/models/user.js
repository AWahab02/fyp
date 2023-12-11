const { string } = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const passwordComplexity = require("joi-password-complexity")


const userSchema = new mongoose.Schema({
    // firstName: { type: String, required: true },
    // lastName: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    library_books: [
        {
            title: { type: String, required: false },
            author: { type: String, required: false },
            pages: { type: String, required: false },
        }
    ],
});

// userSchema.methods.generateAuthToken = function () {
//     const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
//     return token
// };

const User = mongoose.model("user", userSchema)
const Joi = require('joi');

const validate = (data) => {
    const schema = Joi.object({
        // firstName: Joi.string().required().label("First Name"),
        // lastName: Joi.string().required().label("Last Name"),
        username: Joi.string().required().label("Username"), // Updated to match the Mongoose schema
        email: Joi.string().required().label("Email"),
        password: Joi.string().required().label("Password"),
        library_books: Joi.array().items(
            Joi.object({
                title: Joi.string(),
                author: Joi.string(),
                pages: Joi.string(),
            })
        ).label("Library Books"),
    });
    return schema.validate(data);
};

module.exports = {User,validate};