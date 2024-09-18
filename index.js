// imports
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");



const path = require('path'); // Thêm module path Đường dẫn trỏ về file css

const app = express();
const PORT = process.env.PORT || 3000;
// req: request Yêu cầu, res: response Phản hồi
// app.get("/", (req, res) => {
//     res.send("Hello world.");
// })

// Database Connection Old
// mongoose.connect(process.env.DB_URI, { useNewParser: true, useUnifiedTopology: true });
// const db = mongoose.connection;
// db.on("error", (error) => console.log(error));
// db.once("open", () => console.log("Connected to the database!"));

// Database Connection New 
mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;

// db.on("error", ...);: Lắng nghe sự kiện lỗi kết nối. Nếu có lỗi, thông báo lỗi sẽ được in ra console.
// db.once("open", ...);: Lắng nghe sự kiện kết nối thành công. Khi kết nối được thiết lập, thông báo "Connected to the database!" sẽ được in ra console.
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to the database!"));

// Middlewares

// app.use(express.urlencoded({ extended: false }));: Middleware này phân tích cú pháp dữ liệu được gửi từ các form HTML (method="POST") và làm cho nó có sẵn thông qua req.body.
// extended: false cho biết nó sẽ sử dụng thư viện querystring để phân tích cú pháp, phù hợp với hầu hết các trường hợp.
// app.use(express.json());: Middleware này phân tích cú pháp dữ liệu JSON được gửi trong body của request (ví dụ: từ các ứng dụng client sử dụng AJAX) và làm cho nó có sẵn thông qua req.body.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// app.use(session(...));: Middleware này thêm chức năng quản lý session vào ứng dụng. Session cho phép bạn lưu trữ dữ liệu liên quan đến người dùng cụ thể trên server.
// secret: Một chuỗi bí mật được sử dụng để ký cookie session. Giữ chuỗi này an toàn.
// saveUninitialized: Nếu true, một session mới sẽ được tạo ngay cả khi nó chưa được sửa đổi.
// resave: Nếu true, session sẽ được lưu lại vào store ngay cả khi nó không thay đổi.
app.use(
    session({
        secret: "my secret key",
        saveUninitialized: true,
        resave: false,
    })
);

// app.use((req, res, next) => { ... });: Middleware tùy chỉnh này được sử dụng để xử lý flash message. Flash message là những thông báo ngắn gọn được hiển thị cho người dùng một lần, thường sau khi thực hiện một hành động (ví dụ: đăng nhập thành công, lỗi đăng ký).
// res.locals.message = req.session.message;: Gán message từ session vào res.locals để nó có thể được truy cập từ view template.
// delete req.session.message;: Xóa message khỏi session sau khi nó đã được gán vào res.locals để nó chỉ hiển thị một lần.
// next();: Chuyển quyền điều khiển cho middleware tiếp theo trong chuỗi.
app.use((req, res, next) => {
    res.locals.message = req.session.message;
    delete req.session.message;
    next();
});

app.use(express.static("upload"));

// Set template engine
app.set('view engine', 'ejs');

// route prefix
app.use("", require("./routes/routes"));

// Thiết lập thư mục "views/layout/assets" là thư mục chứa các tài nguyên tĩnh
app.use(express.static(path.join(__dirname, 'views', 'layout', 'assets')));
// Thêm module path: Module path được sử dụng để xử lý đường dẫn một cách chính xác, đảm bảo ứng dụng hoạt động trên các hệ điều hành khác nhau.
// Sử dụng express.static: Hàm express.static được dùng để thiết lập một thư mục là nơi chứa các tài nguyên tĩnh (như CSS, JavaScript, hình ảnh).
// path.join(__dirname, 'views', 'layout', 'assets'):
// __dirname: Biến toàn cục chứa đường dẫn đến thư mục hiện tại (thư mục chứa file index.js).
// path.join: Hàm nối các phần đường dẫn lại với nhau một cách an toàn và phù hợp với hệ điều hành.
// Kết quả của path.join sẽ là đường dẫn tuyệt đối đến thư mục assets.

app.listen(PORT, () => {
    console.log(`Server strated at http://localhost:${PORT}`);
})