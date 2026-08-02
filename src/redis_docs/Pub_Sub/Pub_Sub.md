1. Giới thiệu về cấu trúc
    - Publish/Subscribe (Pub/Sub) là một mô hình truyền thông điệp (messaging pattern) mà trong đó bên gửi (Publisher) không gửi tin trực tiếp đến người nhận cụ thể. Thay vào đó, Publisher phát tin nhắn lên các kênh chung (Channels), và bất kỳ bên nhận nào (Subscriber) đăng ký kênh đó đều sẽ nhận được tin.
    - Đặc tính cốt lõi (Fire-and-Forget): Cơ chế Pub/Sub của Redis là truyền tin tức thời và không lưu lại lịch sử (không persist). Nếu Subscriber không online hoặc mất kết nối tại thời điểm tin nhắn được phát đi, tin nhắn đó sẽ bị mất vĩnh viễn và không thể nhận lại khi kết nối lại.
2. Các câu lệnh phổ biến
    - SUBSCRIBE <channel1> [channel2 ...] ==> Đăng ký lắng nghe một hoặc nhiều kênh. Khi đã gọi lệnh này, client sẽ chuyển sang chế độ chỉ đọc và chờ nhận tin nhắn.
    - PUBLISH <channel> <message> ==> Phát một tin nhắn vào kênh chỉ định. Trả về số lượng Subscriber đang lắng nghe kênh đó và đã nhận được tin nhắn.
    - UNSUBSCRIBE [channel1 ...] ==> Hủy đăng ký lắng nghe một hoặc nhiều kênh. Nếu gọi không kèm tham số, client sẽ hủy đăng ký toàn bộ kênh đã đăng ký trước đó.
    - PSUBSCRIBE <pattern1> [pattern2 ...] ==> Đăng ký lắng nghe các kênh khớp với mẫu định dạng (glob-style patterns). Ví dụ: news:* sẽ khớp với news:sport, news:tech.
    - PUNSUBSCRIBE [pattern1 ...] ==> Hủy đăng ký lắng nghe theo mẫu pattern.
    - PUBSUB CHANNELS [pattern] ==> Kiểm tra và liệt kê các kênh đang hoạt động (có ít nhất 1 subscriber).
3. Kịch bản sử dụng
    - Hệ thống Chat Real-time: Phân phối tin nhắn tức thời giữa các người dùng trong cùng một phòng chat.
    - Hệ thống thông báo đẩy (Real-time Notification): Đẩy thông báo tức thời tới giao diện web/app người dùng (ví dụ: thông báo có đơn hàng mới, thông báo shipper đang giao).
    - Giao tiếp giữa các Microservices (Event-driven): Thông báo cho các service khác khi có một sự kiện xảy ra (ví dụ: Service Order phát sự kiện order:created, Service Inventory sẽ sub kênh này để trừ kho).
4. Ví dụ
    Ví dụ 1: Phòng chat cơ bản (PUBLISH/SUBSCRIBE)
        Bước 1: Client A (Người nghe) đăng ký vào phòng chat:
        redis
        SUBSCRIBE chat:room1
        Hệ thống sẽ phản hồi xác nhận đăng ký thành công.
        Bước 2: Client B (Người gửi) gửi tin nhắn vào phòng chat:
        redis
        PUBLISH chat:room1 "Hello room 1!"
        Redis trả về (integer) 1 (tức là tin nhắn đã gửi tới thành công cho 1 subscriber - chính là Client A).
        Bước 3: Kết quả hiển thị bên Client A:
        redis
        1. "message"        # Loại message nhận được
        2. "chat:room1"     # Tên kênh phát tin
        3. "Hello room 1!"  # Nội dung tin nhắn
    Ví dụ 2: Đăng ký theo dõi tin tức đa kênh (dùng mẫu Pattern - PSUBSCRIBE)
        Bước 1: Client A (Người đọc báo) đăng ký nhận toàn bộ tin tức:
        redis
        PSUBSCRIBE news:*
        Client A sẽ lắng nghe toàn bộ các kênh bắt đầu bằng tiền tố news:.

        Bước 2: Các phóng viên cập nhật tin tức thể thao và công nghệ:

        redis


        PUBLISH news:sport "Ronaldo scored a goal!"
        PUBLISH news:tech "New iPhone released!"
        Bước 3: Kết quả Client A nhận được: Nhận tin thể thao:

        redis


        1. "pmessage"
        2. "news:*"
        3. "news:sport"
        4. "Ronaldo scored a goal!"
        Nhận tin công nghệ:

        redis


        1. "pmessage"
        2. "news:*"
        3. "news:tech"
        4. "New iPhone released!"