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

    async getTasks(req, res) {
        const match = {};
        const sort = {};
    
        if (req.query.completed) {
          match.completed = req.query.completed === 'true';
        }
    
        if (req.query.sortBy) {
          const parts = req.query.sortBy.split(':');
          sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }
    
        try {
          await req.user
            .populate({
              path: 'tasks',
              match,
              options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
              }
            })
            .execPopulate();
          res.status(200).send(req.user.tasks);
        } catch (error) {
          res.status(500).json(error);
        }
      },


}
