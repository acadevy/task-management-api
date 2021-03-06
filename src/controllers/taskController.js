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
      async getTaskById(req, res) {
        try {
          const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
          });
    
          if (!task) {
            res.status(404).send('Task not found!');
          }
          res.status(200).send(task);
        } catch (error) {
          res.status(500).send('Task not found!');
        }
      },
      

      async updateTaskById(req, res) {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['description', 'completed'];
        const isValidOperation = updates.every(update =>
          allowedUpdates.includes(update)
        );
    
        if (!isValidOperation) {
          return res.status(400).send({ error: 'Invalid updates!' });
        }
    
        try {
          const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
          });
    
          if (!task) {
            return res.status(404).send('Task not found!');
          }
    
          updates.forEach(update => (task[update] = req.body[update]));
          await task.save();
          res.status(200).send(task);
        } catch (error) {
          res.status(400).send(error);
        }
      },
      async deleteTaskById(req, res) {
        try {
          const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
          });
    
          if (!task) {
            res.status(404).send();
          }
    
          res.send(task);
        } catch (error) {
          res.status(500).send();
        }
      }
}
