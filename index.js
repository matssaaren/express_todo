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
            const tasks = data.split("\n")
            resolve(tasks)
        })
    })
}

app.get('/', (req, res) => {
    console.log('Loading tasks')
    readFile('tasks').then((tasks) => {
        console.log(tasks)
        res.render('index', {tasks: tasks})
    });
});

app.post('/', (req, res) => {
    console.log('Adding task')
    readFile('tasks').then((tasks) => {
        newTask = req.body.task
        if (newTask != "") {
            tasks.push(newTask)
        }
        const data = tasks.join("\n")
        fs.writeFile('tasks', data, (err) => {
            if (err) {
                console.log(err)
                return;
            }
            res.redirect('/')
        })
    })
})

app.listen(3001, () => {
    console.log('http://localhost:3001')
})