const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const TodoSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  complete: {
    type: Boolean,
    default: false
  },
  proj: {
    type: Schema.Types.ObjectId, 
    ref: 'Project'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Todo = mongoose.model('Todo', TodoSchema);

module.exports = Todo;
