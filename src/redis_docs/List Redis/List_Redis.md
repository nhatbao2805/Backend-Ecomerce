1. Giới thiệu về cấu trúc:
    - Là có cấu trúc dữ liệu được lưu trữ đặc biệt tức là mỗi nút liên kết trong danh sách chứa 1 chuỗi bao gồm các lệnh như push, pop v.v
    - Khi dùng redis thì thường sẽ đùng với CSDL có quan hệ (Oracle, Mysql) thì nhớ phải đồng bộ được giữa Redis và CSDL có quan hệ 
    - Còn đối với Mongo thì nó đã lưu theo dạng key-value rồi nên không quá cần thiết

2. Các câu lệnh phổ biến
    - LPUSH <field> <value1> <value2> <value3> ==> nghĩa là sẽ push phần tử từ bên trái vào đầu tiên
    - RPUSH <field> <value1> <value2> <value3> ==> nghĩa là sẽ push phần tử từ bên phải vào đầu tiên
    - LRANGE <field> <start> <end> ==> nghĩa là lấy các phần tử trong <field> từ vị trí <start> tới <end>
    - LPOP <field>  ==> nghĩa là xóa phần tử ngoài cùng bên trái
    - LPOP <field> <count>  ==> nghĩa là xóa <count> phần tử ngoài cùng bên trái
    - RPOP <field>  ==> nghĩa là xóa phần tử ngoài cùng bên phải
    - RPOP <field> <count>  ==> nghĩa là xóa <count> phần tử ngoài cùng bên phải
    - LINDEX <field> <index> ==> lấy phần tử trong <field> tại vị trí <index>
    - LLEN <field>  ==> lấy độ dài của <field>
    - LREM <field> <index> <val[index]>  ==> có nghĩa là phải truyền vào đúng index và giá trị tại index đó thì mới xóa được
    - LTRIM <field> <start> <end> ==> trả về <field> mới có vị trí từ <start> đến <end>
    - EXISTS <field>  ==> trả về 1 nếu như tồn tại <field> và 0 nếu như kh tồn tại
    - LSET <field> <index> <value> ==> nghĩa là cập nhật giá trị tại vị trí <index> thành <value>
    - LINSERT <field> <BEFORE || AFTER> <pivot> <value> ==> nghĩa là chèn <value> <BEFORE || AFTER> <pivot> 
    
    *** Tính năng Blocking trong Redis khi sử dụng stack, vd:có 1 dsach bán vé và có A và B tới cùng mua vé nma A mua được vé trước còn B thì phải đợi ng bán đưa vé
    LPUSH l:ticket ticket:01 -> chỉ còn 1 vé
    LRANGE l:ticket 0 -1 => "ticket:01"
    BLOP l:ticket 0 -> (0 ở đây là timeout) => nghĩa là thằng A sẽ có vé và hệ thống còn 0 vé sau đó th B đơi ng bán thêm vé vào thì mới mua được

3. Kịch bản sử dụng: 
    - Thường dùng để triển khai stack, queue như hàng đợi tin nhắn (Message queue)
      -> Đáp ứng các yêu cầu
        1. Bảo toàn thứ tự tin nhắn -> bản thân thằng List được truy cập theo thứ tự FIFO 
          -> Producer dùng push chèn tin nhắn vào hàng đợi nếu khóa kh tồn tại thì hàng đợi trống và tin nhắn đc chèn vào sau và
             Consummer sẽ dùng RPOP để đọc tin nhắn 
        2. Xử lý tin nhắn trùng lặp 
        3. Độ tin cậy của tin nhắn