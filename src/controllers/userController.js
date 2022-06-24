const User = require('../models/user');
const sharp = require('sharp');



module.exports = {
    async createUser(req, res) {
      const user = new User(req.body);
      try {
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
      } catch (error) {
        res.status(400).json(error);
      }
    },

}