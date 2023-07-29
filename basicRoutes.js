const express = require('express')

const app = express();

app.listen(3000)

app.get('/', (req, res) => {
    // res.send('<h1>Hello World!</h1>')
    res.sendFile('/home/suraj/Documents/node/node_backend/views/index.html')
})

app.get('/about', (req, res) => {
    res.sendFile('./views/about.html', { root: __dirname })
})

app.get('/about-us', (req, res) => {
    res.redirect('/about')
})

app.use((req, res) => {
    res.status(404).sendFile('/home/suraj/Documents/node/node_backend/views/404.html')
})