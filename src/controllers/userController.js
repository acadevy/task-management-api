const User = require('../models/user');
const sharp = require('sharp');
// const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');


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

      async logoutAllUser(req, res) {
        try {
          req.user.tokens = [];
          await req.user.save();
    
          res.status(200).send('User logged out from all sessions!');
        } catch (error) {
          res.status(500).send(error);
        }
      },

      async getUser(req, res) {
        res.status(200).send(req.user);
      },
    
      async getUserById(req, res) {
        try {
          const user = await User.findById(req.params.id);
          if (!user) {
            res.status(404).send('User not found!');
          }
          res.status(200).send(user);
        } catch (error) {
          res.status(500).json(error);
        }
      },
    
      async updateUserInfo(req, res) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password', 'age'];
        const isValidOperation = updates.every(update =>
          allowedUpdates.includes(update)
        );
    
        if (!isValidOperation) {
          return res.status(400).send({ error: 'Invalid updates!' });
        }
    
        try {
          updates.forEach(update => (req.user[update] = req.body[update]));
          await req.user.save();
          res.status(200).send(req.user);
        } catch (error) {
          res.status(400).send(error);
        }
      },

      async uploadUserAvatar(req, res) {
        const buffer = await sharp(req.file.buffer)
          .resize({ width: 250, height: 250 })
          .png()
          .toBuffer();
    
        req.user.avatar = buffer;
        await req.user.save();
        res.send('Uploaded');
      },
    
      async deleteUserAvatar(req, res) {
        if (!req.user.avatar) {
          res.status(406).send('You do not have an avatar!');
        }
        req.user.avatar = undefined;
        await req.user.save();
        res.send('Avatar deleted!');
      },
    
      async getUserAvatar(req, res) {
        try {
          if (!req.user.avatar) {
            throw new Error('No avatar!');
          }
    
          res.set('Content-Type', 'image/png');
          res.send(req.user.avatar);
        } catch (error) {
          res.status(400).send({ error: error.message });
        }
      },
    
      async getUserAvatarById(req, res) {
        try {
          const user = await User.findById(req.params.id);
          if (!user || !user.avatar) {
            throw new Error('No avatar!');
          }
    
          res.set('Content-Type', 'image/jpg');
          res.send(user.avatar);
        } catch (error) {
          res.status(400).send({ error: error.message });
        }
      },
    
      async deleteUser(req, res) {
        try {
          await req.user.remove();
        //   sendCancelationEmail(req.user.email, req.user.name);
          res.status(200).send(req.user);
        } catch (error) {
          res.status(500).json(error);
        }
      }
    
}