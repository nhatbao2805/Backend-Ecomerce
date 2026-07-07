require('dotenv').config();
const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

//khởi tạo express

const app = express();

app.use(morgan("dev"));
/*
morgan("dev") -> thường dùng cho môi trường dev để in ra các thông tin về giao thức phản hồi
morgan("combined")-> thường dùng cho môi trường production để in ra các thông tin về giao thức phản hồi
morgan("common")
morgan("short")
morgan("tiny")
*/
app.use(helmet());
/* dùng để ngăn chặn các bên thứ 3 vào đọc cookies của mình */
app.use(compression());
//init middlewears
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
/*
 giúp giảm băng thông và tăng tốc độ tải trang,
  đặc biệt với response JSON lớn hoặc file tĩnh.
*/
// const { checkOverload } = require('./helpers/check.connection.');
// checkOverload();

//init db
require('./dbs/init.mongodb');
//init router
app.use('', require('./routes/index'))
//handling errors


module.exports = app;