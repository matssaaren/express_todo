const express = require('express')
const app = express()

// ejs
const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    console.log('niggert worked')
    res.render('index')
})

app.listen(3001, () => {
    console.log('Get logged niggert')
})