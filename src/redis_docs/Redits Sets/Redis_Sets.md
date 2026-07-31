1. Giới thiệu về cấu trúc:
    - Là một bộ tập hợp có thứ tự chứa các string (chuỗi) giống các phương thức có trong chuỗi và ngoài ra có thêm tính toán giao nhau giữa các bộ sưu tập
    - Bộ tập lợp lưu trữ không có thứ tự khác với List là sẽ có thứ tự FIFO
    - Sets chỉ lưu các phần tử là độc nhất còn List thì có thể lưu trữ các phần tử đc lặp lại

2. Các câu lệnh phổ biến
    - SADD <key> <value1> <value2> <value3> ==> nghĩa là thêm vào key các <value1-3>
    - SMEMBERS <key> ==> nghĩa là lấy các giá trị của <key>
    - SREM <key> <value>  ==> nghĩa là xóa 1 <value> của <key>
    - SCARD <key> ==> nghĩa là đếm các giá trị gắn với <key>
    - SISMEMBER <key> <value> ==> nghĩa là kiểm tra xem <value> có tồn tại trong <key> chưa nếu 1 là đã tồn tại 0 là chưa tồn tại
    - SRANDMEMBER <key> <count> ==> nghĩa là chọn random <count> giá trị trong <key>
    - SPOP <key> <count> ==> nghĩa là xóa <count> ở trong <key> sẽ remove từ bên trái sang 
    - SMOVE <key1> <key2> <value> ==> nghĩa là di chuyển <value> của <key1> sang <key2> (và kh còn <value> trong <key1> nữa)
    - SINTER <key1> <key2> ==> nghĩa là trả về điểm chung của <key1> <key2> 
    - SDUFF <key1> <key2> ==> nghĩa là trả về giá trị khác biệt của <key1> so với <key2> 

3. Kịch bản sử dụng: 
    - Thường dùng để triển khai tìm các phần chung phần giao nhau (ví dụ như bạn chung của twitter, hoặc ai đang like 1 bài viết)

4. Ví dụ: 
    1. Case like của một bài viết 
        SADD feed:1 userId:1
        SADD feed:1 userId:2
        SADD feed:1 userId:3

        SCARD feed:1 ==> 3 có 3 like của bài viết
        
        SREM feed:1 userId:1 => còn 2 like vì thằng userId:1 đã unlike bài viết 1
        
        SISMEMBER feed:1 userId:1 => trả về 0 vì userId:1 đã unlike bài viết
        SISMEMBER feed:1 userId:2 => trả về 1 vì userId:2 đang like bài viết

    2. Case bạn chung trong MXH
        SADD cr7 1 2 3 4 5 6 7  => cr7 có 7 người bạn 
        SADD m10 5 6 7 8 9 10 => m10 có 6 người bạn 
        
        SINTER cr7 m10 => 5,6,7 trả về điểm chung của cả 2
        SDUFF cr7 m10 => 1,2,3,4 trả về giá trị khác biệt của cr7 so với m10