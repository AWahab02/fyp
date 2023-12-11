const router = require("express").Router();
const { User, validate } = require("../models/user");



router.post("/", async (req, res) => {

  try {

    console.log(req.body)
    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    await new User(req.body).save(); // Store the plain text password directly
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get('/profile', async (req, res) => {
  try {
    // Assuming you have authentication middleware that sets user information in req.user
    console.log('HERE IS THE USER', req.query.email)

    const user = await User.findOne({ email: req.query.email });
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Here, you should send the user's profile data as a response
    res.send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }

});

router.put('/profile', async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Update the user's profile data
    user.username = username;
    user.password = password;

    await user.save();

    // Send a success response
    res.status(200).send({ message: 'User data updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});


router.put('/addBook', async (req, res) => {
  try {
    const { email, newBook } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    // Add the new book to the user's library_books array
    user.library_books.push(newBook);

    await user.save();

    // Send a success response
    res.status(200).send({ message: 'Book added to the library successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;
