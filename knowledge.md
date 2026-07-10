Từ khóa static trong JavaScript được dùng để định nghĩa các phương thức hoặc thuộc tính thuộc về chính lớp đó, thay vì thuộc về các thực thể (instance) được tạo ra từ lớp.
## 📌 Đặc điểm cốt lõi

* Không cần khởi tạo: Gọi trực tiếp qua tên lớp, không dùng từ khóa new.
* Không dùng this thông thường: Không thể truy cập dữ liệu của thực thể bằng this.
* Tiết kiệm bộ nhớ: Chỉ tồn tại một bản sao duy nhất trong suốt chương trình.

## 💻 Ví dụ minh họa

class CongCu {
  // Thuộc tính static
  static tenUngDung = "Trình Tính Toán";

  // Phương thức static
  static tinhTong(a, b) {
    return a + b;
  }
}
// 🟩 CÁCH DÙNG ĐÚNG: Gọi trực tiếp từ Lớp
console.log(CongCu.tenUngDung); // Đầu ra: Trình Tính Toán
console.log(CongCu.tinhTong(5, 3)); // Đầu ra: 8
// 🟥 CÁCH DÙNG SAI: Gọi từ thực thểconst myTool = new CongCu();
console.log(myTool.tinhTong(5, 3)); // Lỗi: myTool.tinhTong is not a function

## 🎯 Khi nào nên dùng?

* Hàm tiện ích (Utility functions): Các hàm tính toán thuần túy không phụ thuộc vào trạng thái đối tượng (Ví dụ: Math.sqrt()).
* Cấu hình chung (Global configuration): Lưu trữ các hằng số, cấu hình dùng chung cho toàn bộ ứng dụng.
* Tạo bản sao (Factory methods): Các hàm đặc biệt dùng để khởi tạo đối tượng từ các nguồn dữ liệu khác nhau.

Bạn có muốn tìm hiểu thêm về cách kế thừa (inheritance) các thuộc tính static này từ lớp cha sang lớp con, hoặc cách kết hợp nó với các thuộc tính private (#) không?

options = { upsert: true, new: true }

upsert: true: nếu không tìm thấy document khớp filter → tự tạo mới (dùng data từ filter + update). Nếu tìm thấy → update như bình thường.
new: true: trả về document sau khi update/tạo mới (mặc định false sẽ trả về bản ghi cũ trước khi update).

→ Dùng khi cần: "có thì update, chưa có thì tạo mới, và lấy ngay kết quả mới nhất để dùng tiếp". Đây là pattern rất phổ biến và đúng chuẩn cho việc lưu/refresh key-token theo user trong hệ thống auth (JWT + refresh token rotation).