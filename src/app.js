const compression = require('compression');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
//khởi tạo express

const app = express();

//init middlewears
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
/*
 giúp giảm băng thông và tăng tốc độ tải trang,
  đặc biệt với response JSON lớn hoặc file tĩnh.
*/


//init db

//init route
app.get("/", (req, res, next) => {
    const strCompress = "Hello nnn";
    return res.status(200).json({
        message: "welcome ",
        metaData: strCompress.repeat(10000)
    })
})

//handling errors


module.exports = app;