const mongoose = require('mongoose');


mongoose.connect('mongodb://localhost:27017/task_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected successfully.'))
.catch(err => console.log(err));


module.exports = {
  mongoose
};


