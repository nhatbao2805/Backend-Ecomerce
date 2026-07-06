const mongoose = require('mongoose');
const os = require('os');
const process = require('process');
const _SECONDS = 5000;

//count connection
const countConnection = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connections: ${numConnection}`);
}

//check overload connect

const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose.connections.length;
        const numCores = os.cpus().length; // lấy số nhân cpu
        const numMemory = os.freemem() / 1024 / 1024 / 1024; // lấy dung lượng ram
        //Example maxium number of connections based on number of cores
        const maxConnections = numCores * 5;
        // console.log(`Number of connections: ${numConnection}`);
        // console.log(`Memory usage: ${numMemory / 1024 / 1024} MB`)
        if (numConnection >= maxConnections) {
            console.log('Connection overload detected');
            // notify.send() to team for sever overload 
        }

    }, _SECONDS) // monitor every 5s
}

module.exports = {
    countConnection,
    checkOverload
}