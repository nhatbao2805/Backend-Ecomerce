1. Giới thiệu về cấu trúc:
    - Là kdl cơ bản nhất có thể lưu trữ bất kỳ loại dữ liệu nào như text, number, image hoặc là 1 object được tuần tự hóa lưu tối đa 512MB
    - Embstring (<= 44 bytes lưu trữ dữ liệu chuỗi) , raw (>44 bytes lưu trữ dữ liệu chuỗi), int (integer)

2. Các câu lệnh phổ biến
    - SET <key> <value> ==> để gán giá trị
    - SET <key> <value> EX <time>(tính bằng seconds) ==> gán một giá trị tồn tại trong <time> 
    - SETNX <key> <value> ==> nếu như key chưa tồn tại thì sẽ được phép gán giá trị trả về 1 ngược lại thì trả về 0 và kh có được gán giá trị
    - GET <key> ==> để lấy giá trị
    - EXISTS <key> ==> để check xem key có tồn tại hay không ( 1 là có , 0 là kh tồn tại)
    - STRLEN <key> ==> để lấy độ dài value
    - object encoding <key> ==> để kiểm tra là Embstring hay là raw hay là int
    - DEL <key> ==> để xóa ( 1 là xóa thành công , 0 là thất bại)
    - MSET <key1> <value1> <key2> <value2> ==> để gán một loạt giá trị
    - MGET <key1> <key2> ==> để lấy một loạt giá trị
    - INCR <key> ==> để tăng value lên 1 lần
    - INCRBY <key> <valueBy> ==> để tăng value lên valueBy lần
    - DECR <key> ==> để giảm value lên 1 lần
    - DECRBY <key> <valueBy> ==> để giảm value lên valueBy lần
    - KEYS '<key>' ==> để kiểm tra xem có các key nào tồn tại
    - EXPIRE <key> <time>(tính bằng seconds) ==> cho phép một key tồn tại trong <time>
    - TTL <key>  ==> kiểm tra key còn tồn tại trong bao lâu 

3. Kịch bản sử dụng: 
    - Đa phần sẽ sử dụng để cache
    - Bởi vì redis xử lý các lệnh với luồng duy nhất nên quá trình thực thi các lệnh là atomic do đó kiểu dữ liệu string để count như số lượt truy cập lượt thích lượt đăng lại
    - Khóa phân tán sẽ dùng SETNX sẽ chèn khi khóa không tồn tại (các db phân tán sẽ dùng chung 1 redis để lưu section khi người dùng gọi xuống bất kỳ db nào cũng sẽ có session)