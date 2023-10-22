const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");


router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		console.log(req.body.password);
		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "Invalid Email" });

		// const validPassword = await bcrypt.compare(
		// 	req.body.password,
		// 	user.password
		// );

		if (req.body.password != user.password)
		{
			return res.status(401).send({ message: "Invalid Password" });
		}
		console.log(user.password);

		// if (validPassword)
		// 	return res.status(401).send({ message: "Invalid Password" });

		// const token = user.generateAuthToken();
		const token = jwt.sign({_id: user._id, _email: user.email}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"});
		res.json({ token });

		// const token12 = jwt.sign({ _id: user._id, email: user.email });
		// res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;