1. Giới thiệu về cấu trúc:
    - Là tập hợp một cặp key value có thể lưu trữ nhiều trường và giá trị khác nhau

2. Các câu lệnh phổ biến
    - HSET <field> <key> <value>  ==> để gán cho một <field> có 1 cặp <key> <value>
    - HMSET <field> <key1> <value1> <key2> <value2> ==> để gán cho một <field> có nhiều cặp <key> <value>
    - HGET <field> <key1> ==> để lấy giá trị cho <key1> 
    - HGETALL <field> ==> để trả về tất cả có trong <field> 
    - HMGET <field> <key1> <key2> ==> để lấy giá trị cho các <key1> và <key2>
    - HDEL <field> <key>  ==> để xóa đi <value> của <key> đó ( 1 là xóa thành công , 0 là thất bại)
    - HLEN <field>  ==> trả về số trường đang có trong <field>
    - HEXISTS <field> <key> ==> kiểm tra xem <key> có tồn tại trong <field> hay không 
    - HINCR <field> <key> ==> để tăng value lên 1 lần
    - HINCRBY <field> <key> <valueBy> ==> để tăng value lên valueBy lần
    - HDECR <field> <key> ==> để giảm value lên 1 lần
    - HDECRBY <field> <key> <valueBy> ==> để giảm value lên valueBy lần
    - HKEYS <field> ==> để lấy các key có trong <field> 
    - HVALS <field> ==> để lấy các value có trong <field> 

3. Kịch bản sử dụng: 
    - Cache: tuy nhiên sẽ khác với string là ngắn gọn hơn string và update insert nhanh gọn
    - Giỏ hàng