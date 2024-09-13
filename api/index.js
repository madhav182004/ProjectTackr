if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
const Todo = require('./models/Todo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET_KEY;

const MONGO_URL = process.env.DB_URL;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

main()
  .then(() => {
    console.log('connected to DB');
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const userDoc = await User.findOne({ username });
  if (!userDoc) {
    return res.status(400).json('User not found');
  }
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    jwt.sign({ username, id: userDoc._id }, secret, {}, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, { httpOnly: true, sameSite: 'strict' }).json({
        id: userDoc._id,
        username,
      });
    });
  } else {
    res.status(400).json('Wrong credentials');
  }
});

app.get('/profile', (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: 'Token is missing' });
  }
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid' });
    }
    res.json(info);
  });
});

app.post('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, sameSite: 'strict' }).json('ok');
});

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split('.');
  const ext = parts[parts.length - 1];
  const newPath = path + '.' + ext;
  fs.renameSync(path, newPath);

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const projectDoc = await Project.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(projectDoc);
  });
});

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) return res.status(403).json({ error: 'Token is invalid' });
    const { id, title, summary, content } = req.body;
    const projectDoc = await Project.findById(id);
    if (!projectDoc) return res.status(404).json('Project not found');
    const isAuthor = JSON.stringify(projectDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(403).json('You are not the author');
    }

    await Project.updateOne(
      { _id: id },
      {
        $set: {
          title,
          summary,
          content,
          cover: newPath ? newPath : projectDoc.cover,
        },
      }
    );

    const updatedProject = await Project.findById(id); 
    res.json(updatedProject);
  });
});

app.get('/post', async (req, res) => {
  res.json(
    await Project.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

app.get('/post/:id', async (req, res) => {
  const { id } = req.params;
  const projectDoc = await Project.findById(id).populate('author', ['username']);
  if (!projectDoc) return res.status(404).json('Project not found');
  res.json(projectDoc);
});

app.get('/post/:id/todos', async (req, res) => {
  try {
    const todos = await Todo.find({ proj: req.params.id });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/post/:id/todo/new', async (req, res) => {
  const { id } = req.params;
  const todo = new Todo({
    text: req.body.text,
    proj: id, 
  });

  try {
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


app.delete('/post/:id/todo/delete/:todoid', async (req, res) => {
	const result = await Todo.findByIdAndDelete(req.params.todoid);
	res.json({ result });
});

app.put('/post/:id/todo/complete/:todoId', async (req, res) => {
  const { todoId } = req.params;
  try {
      const todo = await Todo.findById(todoId);
      if (!todo) return res.status(404).json({ message: 'Todo not found' });

      todo.complete = !todo.complete;
      await todo.save();

      res.json(todo);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});


app.listen(4000, () => {
  console.log('Server running on port 4000');
});

