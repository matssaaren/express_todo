const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');

// body-parser allows us to read the body of a request
app.use(express.urlencoded({ extended: true }));

// ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const readFile = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

const writeFile = async (filePath, data) => {
  await fs.writeFile(filePath, data, 'utf8');
};

app.get('/', async (req, res) => {
  try {
    const tasks = await readFile('tasks.json');
    res.render('index', { tasks, edit: null, error: null });
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error reading tasks' });
  }
});

app.get('/update-task/:index', async (req, res) => {
  const index = parseInt(req.params.index);
  try {
    const tasks = await readFile('tasks.json');
    res.render('index', { tasks, edit: index, error: null });
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error reading tasks' });
  }
});

app.post('/update-task/', async (req, res) => {
  const index = parseInt(req.body.edit);
  const updatedTask = req.body.task;
  try {
    const tasks = await readFile('tasks.json');
    if (index >= 0 && index < tasks.length) {
      tasks[index].task = updatedTask;
      await writeFile('tasks.json', JSON.stringify(tasks, null, 2));
      res.redirect('/');
    } else {
      res.render('index', { tasks, edit: null, error: 'Invalid task index' });
    }
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error updating task' });
  }
});

app.post('/', async (req, res) => {
  const newTask = req.body.task;
  try {
    const tasks = await readFile('tasks.json');
    tasks.push({ id: tasks.length + 1, task: newTask });
    await writeFile('tasks.json', JSON.stringify(tasks, null, 2));
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error adding task' });
  }
});

app.get('/delete-task/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    let tasks = await readFile('tasks.json');
    tasks = tasks.filter(task => task.id !== id);
    await writeFile('tasks.json', JSON.stringify(tasks, null, 2));
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error deleting task' });
  }
});

app.get('/clear-all/', async (req, res) => {
  try {
    await writeFile('tasks.json', JSON.stringify([], null, 2));
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error clearing tasks' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.post('/', async (req, res) => {
  const newTask = req.body.task;
  try {
    const tasks = await readFile('tasks.json');
    if (newTask.trim().length === 0) {
      const error = 'Please insert correct task data';
      res.render('index', { tasks, error });
    } else {
      let index;
      if (tasks.length === 0) {
        index = 0;
      } else {
        index = tasks[tasks.length - 1].id + 1;
      }
      const newTaskObj = {
        id: index,
        task: newTask,
      };
      tasks.push(newTaskObj);
      await writeFile('tasks.json', JSON.stringify(tasks, null, 2));
      res.redirect('/');
    }
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], error: 'Error adding task' });
  }
});

app.get('/update-task/:taskId', async (req, res) => {
  const updateTaskId = parseInt(req.params.taskId);
  try {
    const tasks = await readFile('tasks.json');
    const taskToEdit = tasks.find(task => task.id === updateTaskId);
    res.render('index', { tasks, edit: updateTaskId, error: null });
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error reading tasks' });
  }
});

app.post('/update-task/', async (req, res) => {
  const index = parseInt(req.body.edit);
  const updatedTask = req.body.task;
  try {
    const tasks = await readFile('tasks.json');
    if (index >= 0 && index < tasks.length) {
      tasks[index].task = updatedTask;
      await writeFile('tasks.json', JSON.stringify(tasks, null, 2));
      res.redirect('/');
    } else {
      res.render('index', { tasks, edit: null, error: 'Invalid task index' });
    }
  } catch (err) {
    console.error(err);
    res.render('index', { tasks: [], edit: null, error: 'Error updating task' });
  }
});

app.listen(3001, () => {
  console.log('http://localhost:3001');
});