1. Giới thiệu về cấu trúc:
    - Là một bộ tập hợp có thứ tự chứa các string (chuỗi) giống các phương thức có trong chuỗi và ngoài ra có thêm tính toán giao nhau giữa các bộ sưu tập
    - Bộ tập lợp lưu trữ có thứ tự khác với Sets là tập hợp lưu trữ kh có thứ tự

2. Các câu lệnh phổ biến
    - ZADD <field> <key1><value1> <key2><value2> <key3><value3> ==> nghĩa là thêm vào cặp <key><value> vào trong <field>
    - ZREVANGE <field> <start> <end> ==> nghĩa là lấy các giá trị được sắp xếp giảm dần của <field> từ <start> đến <end>
    - ZREANGE <field> <start> <end> ==> nghĩa là lấy các giá trị được sắp xếp tăng dần của <field> từ <start> đến <end>
    - ZREM <field> <key> ==> nghĩa là xóa đi <key> ở trong <field>
    - ZCARD <field> ==> nghĩa là trả về số lượng <key><value> ở trong <field>
    - ZINCRBY <field> <count> <key> ==> nghĩa là tăng <count> lần <value> của <key> ở trong <field>
    - ZRANGEBYSCORE <field> <min> <max> ==> nghĩa là trả về các <key><value> hợp lệ từ <min> tới <max> ở trong <field>
    

3. Kịch bản sử dụng: 
    - Thường dùng để triển khai tìm các sản phẩm được bán chạy nhất trong hệ thống e-commerce
