const http = require('http')
const fs = require('fs')
const _ = require('lodash')

const server = http.createServer((req, res) => {
    console.log("request has been made")

    let path = './views'

    switch (req.url) {
        case '/':
            path += '/index.html'
            res.statusCode = 200
            break
        case '/about':
            path += '/about.html'
            res.statusCode = 200;
            break
        case '/about-me':
            res.statusCode = 301
            res.setHeader('Location', '/about')
            res.end()
        default:
            path += '/404.html'
            res.statusCode = 404
            break
    }

    console.log(path)

    res.setHeader('Content-Type', 'text/html')
    fs.readFile(path, (err, fileData) => {
        if (err) {
            console.log(err)
        } else {
            res.write(fileData)
            res.end()
        }
    })
})

server.listen(3000, 'localhost', () => {
    console.log("server is listerning to port 3000")
})