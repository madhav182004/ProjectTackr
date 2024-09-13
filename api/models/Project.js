const mongoose = require('mongoose');
const {Schema,model} = mongoose;

const ProjectSchema = new Schema({
  title:String,
  summary:String,
  content:String,
  cover:String,
  author:{
    type:Schema.Types.ObjectId, 
    ref:'User'
  },
},
{
    timestamps: true,
});

const ProjectModel = model('Project', ProjectSchema);

module.exports = ProjectModel;