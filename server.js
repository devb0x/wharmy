const app = require('./backend/app')
const http = require('http')

const port = process.env.PORT || 3000

app.set('port', port)
console.log(port)
const server = http.createServer(app)

server.listen(port)