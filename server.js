const app = require("./app");

// khởi động network nodeJS
const server = app.listen(3001, () => {
    console.log(`Server is running on port ${3001}`);
})

// process.on('SIGINT', () => {
//     console.log('Shutting down server...');
//     server.close(() => {
//         console.log('Server closed...');
//     })
// })