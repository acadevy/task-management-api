const Task = require('../models/task');


module.exports = {
    async createTask(req, res) {
      const task = new Task({
        ...req.body,
        owner: req.user._id
      });
  
      try {
        await task.save();
        res.status(201).send(task);
      } catch (error) {
        res.status(400).json(error);
      }
    },


}
