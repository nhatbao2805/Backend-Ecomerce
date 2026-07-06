const app = require("./src/app");
const { app: { port } } = require('./src/configs/config.mongodb')
// khởi động network nodeJS

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

// process.on('SIGINT', () => {
//     console.log('Shutting down server...');
//     server.close(() => {
//         console.log('Server closed...');
//     })
// })