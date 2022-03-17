const socketio = require('socket.io');
const express = require("express");
const http = require('http');

start();

function start(){
    console.clear();

    setEnv()
    console.log('Environment vars set');
    
    let server = startHttpServer()
    console.log('HTTP server started');
    
    startSocketServer(server)
    console.log('SocketIO server started');
}

function startSocketServer(server){
    const io = socketio(server);

    io.on('connection', socket => {
        console.log('Socket connected!');
        socket.on('disconnect', () => {
            console.log('Socket disconnected!');
        })
    })
}

function startHttpServer(){
    let app = express();
    let server = http.createServer(app);

    app.all("*", (req, res, next) => {
        console.log(`${new Date().toLocaleString()} | ${req.socket.remoteAddress} | ${req.url}`);
        next();
    });

    app.get('/', (req, res) => {
        res.render('lobby');
    })
    
    // EJS for front end
    app.set('view engine', 'ejs')

    // Public path for assets
    app.use(express.static(process.env.PUBLIC_PATH));
    
    server.listen(process.env.PORT, () => {
        console.log(`HTTP server running on port ${process.env.PORT}`);
    });

    return server
}

function setEnv(){
    // Set environment variables
    process.env.PORT = 8080;
    process.env.PUBLIC_PATH = `${__dirname}/public`;
}