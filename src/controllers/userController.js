const User = require('../models/user');
const sharp = require('sharp');



module.exports = {
    async createUser(req, res) {
      const user = new User(req.body);
      try {
        await user.save();
        // sendWelcomeEmail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
      } catch (error) {
        res.status(400).json(error);
      }
    },

    async loginUser(req, res) {
        try {
          const user = await User.findByCredentials(
            req.body.email,
            req.body.password
          );
          const token = await user.generateAuthToken();
          res.send({ user, token });
        } catch (error) {
          res.status(400).send(error);
        }
      },

      async logoutUser(req, res) {
        try {
          req.user.tokens = req.user.tokens.filter(
            token => token.token !== req.token
          );
          await req.user.save();
    
          res.status(200).send('User logged out!');
        } catch (error) {
          res.status(500).send(error);
        }
      },
}