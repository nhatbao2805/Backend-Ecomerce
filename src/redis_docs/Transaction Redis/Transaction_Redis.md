1. Giới thiệu về cấu trúc:
    - Transaction (MULTI/EXEC) là một tập hợp các lệnh được gom lại, thực thi tuần tự và độc quyền (atomic theo nhóm) — không lệnh nào của client khác được xen vào giữa
    - Nếu không có lỗi cú pháp, toàn bộ lệnh trong nhóm sẽ được thực thi; nếu 1 lệnh trong lúc chạy bị lỗi thì các lệnh khác vẫn tiếp tục chạy (Redis không rollback)

2. Các câu lệnh phổ biến
    - MULTI ==> bắt đầu một khối transaction, các lệnh sau đó sẽ được xếp vào hàng đợi
    - <lệnh bất kỳ> ==> các lệnh gọi sau MULTI sẽ không thực thi ngay mà được xếp vào queue, trả về QUEUED
    - EXEC ==> thực thi toàn bộ lệnh đã xếp trong queue theo đúng thứ tự, trả về mảng kết quả tương ứng từng lệnh
    - DISCARD ==> huỷ toàn bộ lệnh đang nằm trong queue, thoát khỏi transaction mà không thực thi gì cả
    - WATCH <key1> <key2> ==> theo dõi các key này, nếu có key nào bị thay đổi bởi client khác trước khi EXEC thì toàn bộ transaction sẽ bị huỷ (EXEC trả về nil)
    - UNWATCH ==> bỏ theo dõi toàn bộ key đã WATCH trước đó

3. Kịch bản sử dụng: 
    - Thường dùng để chuyển tiền giữa 2 tài khoản, đặt hàng trừ kho, hoặc bất kỳ thao tác nào cần đảm bảo nhiều lệnh cùng thực thi như một khối, tránh bị client khác đọc/ghi xen giữa

4. Ví dụ: 
    1. Case chuyển tiền giữa 2 ví
        MULTI
        DECRBY wallet:a 100
        INCRBY wallet:b 100
        EXEC ==> cả 2 lệnh trừ/cộng tiền chạy liền mạch, không client nào chen vào giữa

    2. Case đặt hàng có kiểm tra tồn kho (dùng WATCH tránh race condition)
        WATCH stock:sp1
        GET stock:sp1 => giả sử trả về 5, đủ hàng để bán

        MULTI
        DECRBY stock:sp1 1
        INCR order:count
        EXEC ==> nếu không ai khác sửa stock:sp1 kể từ lúc WATCH, lệnh chạy bình thường
        
        => nếu giữa lúc WATCH và EXEC có client khác sửa stock:sp1 (ví dụ bán mất 1 đơn khác), EXEC trả về nil, giao dịch bị huỷ, cần WATCH và thử lại từ đầu