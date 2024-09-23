const express = require('express')
const bp = require("body-parser");
const app = express()
const fs = require('fs');
const { type } = require('os');

// body-parser allows us to read the body of a request
app.use(bp.urlencoded({ extended: true }));

// ejs
const path = require('path');
const { rejects } = require('assert');
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
    return new Promise((resolve, reject) => {
        // get the tasks from the file
        fs.readFile(filename, 'utf8', (err, data) => {
            if (err) {
                reject(err)
            }
            // tasks list data from file
            const tasks = JSON.parse(data)
            resolve(tasks)
        })
    })
}

const writeFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        // write the tasks to the file
        fs.writeFile(filename, data, (err) => {
            if (err) {
                console.error(err)
                reject(err)
            }
            resolve(true)
        })
    })
}

app.get('/', (req, res) => {
    console.log('Loading tasks')
    readFile('tasks.json').then((tasks) => {
        console.log(tasks)
        res.render('index', {tasks: tasks})
    });
});

app.post('/', (req, res) => {
    console.log('Adding task')
    readFile('tasks.json').then((tasks) => {
        let index
        // console.log(tasks)
        // console.log(tasks.length)
        // console.log(tasks[1])
        if (tasks.length === 0) {
            index = 0
        } else {
            // console.log(tasks[tasks.lenght - 1])
            index = tasks[tasks.length - 1].id + 1
        }
        const newTask = {
            'id': index,
            'task': req.body.task,
        }
        console.log(newTask)
        tasks.push(newTask)
        console.log(tasks)
        data = JSON.stringify(tasks, null, 2)
        console.log(data)
        newTaskText = req.body.task
        if (newTaskText != "") {
            tasks.push(newTask)
        }
        writeFile('tasks.json', data)
        res.redirect('/')
        
    })
})

app.get('/delete-task/:taskId', (req, res) => {
    let deleteTaskId = parseInt(req.params.taskId)
    console.log('Deleting task id: ' + deleteTaskId)
    readFile('tasks.json').then((tasks) => {
        tasks.forEach((task, index) => {
            if (task.id === deleteTaskId) {
                tasks.splice(index, 1)
            }
        });
        data = JSON.stringify(tasks, null, 2)
        writeFile('tasks.json', data)
        res.redirect('/')
    })
})
app.get('/clear-all/', (req, res) => {
    console.log('Clearing all tasks')
    tasks = []
    data = JSON.stringify(tasks, null, 2)
    writeFile('tasks.json', data)
    res.redirect('/')
})
app.listen(3001, () => {
    console.log('http://localhost:3001')
})