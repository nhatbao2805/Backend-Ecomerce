# TÀI LIỆU HƯỚNG DẪN TÍCH HỢP (GUIDE) WEB & CMS + ĐÁNH GIÁ CHẤT LƯỢNG MÃ NGUỒN BACKEND

Tài liệu này dựa trên việc phân tích chi tiết toàn bộ source code backend hiện tại của bạn. Tài liệu được chia làm 5 phần chính:
1. **Tổng quan kiến trúc & các mẫu thiết kế**
2. **Hướng dẫn tích hợp giao diện Web (Customer-facing Storefront)**
3. **Hướng dẫn tích hợp giao diện CMS (Merchant/Admin Dashboard)**
4. **Các lỗi logic & cú pháp nghiêm trọng cần sửa đổi ngay trong Backend**
5. **Đề xuất các tính năng còn thiếu và giải pháp bổ sung để hoàn thiện dự án**

---

## 1. Tổng quan kiến trúc & mẫu thiết kế áp dụng

Hệ thống được phát triển trên nền tảng **Node.js, Express, Mongoose (MongoDB)** và tích hợp các kỹ thuật xử lý nâng cao:
*   **Factory & Strategy Pattern**: Được sử dụng trong [product.service.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/services/product.service.js) để đăng ký và khởi tạo động các loại sản phẩm khác nhau (`Clothing`, `Electronic`,...) thông qua cơ chế Registry.
*   **Builder Pattern**: Định nghĩa trong [discount.builder.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/builders/discount.builder.js) dùng để chuẩn hóa việc kiểm tra điều kiện ngày bắt đầu/kết thúc khi thiết lập coupon giảm giá.
*   **JWT & Key Rotation**: Hệ thống bảo mật lưu hai mã khóa công khai/bí mật (`publicKey`, `privateKey`) ngẫu nhiên cho mỗi phiên đăng nhập để ký mã hóa Token. Đồng thời áp dụng thuật toán xoay vòng Refresh Token nâng cao để phát hiện và ngăn chặn token bị đánh cắp.
*   **Optimistic Locking (Khóa lạc quan)**: Hỗ trợ đặt giữ hàng tồn kho (`inven_reservations` trong Inventory) trước khi đặt hàng thành công để phòng tránh tình trạng đặt mua trùng lặp (Over-selling).

---

## 2. Hướng dẫn tích hợp Giao diện Web (Client Storefront)

Giao diện Web là nơi Khách hàng (Customer) tương tác để mua hàng.

### 2.1. Danh sách luồng xử lý chính & API tương ứng

#### A. Duyệt sản phẩm công khai (Không cần đăng nhập)
*   **Lấy danh sách tất cả sản phẩm**:
    *   **API**: `GET /v1/api/product`
    *   **Query Params**: `limit=50&sort=ctime&page=1`
*   **Tìm kiếm sản phẩm bằng từ khóa**:
    *   **API**: `GET /v1/api/product/search/:keySearch`
*   **Xem chi tiết một sản phẩm**:
    *   **API**: `POST /v1/api/product/:product_id` *(Lưu ý: API hiện tại đang định nghĩa dùng phương thức `POST` thay vì `GET` thông thường)*.
*   **Duyệt danh sách coupon áp dụng được cho sản phẩm**:
    *   **API**: `GET /v1/api/discount/list_product`
    *   **Query Params**: `code=COUPON_CODE&shopId=SHOP_ID&limit=10&page=1`

#### B. Quản lý Giỏ hàng (Yêu cầu Authentication)
*Headers bắt buộc: `x-api-key`, `x-client-id` (userId/shopId), `authorization` (accessToken)*
*   **Lấy chi tiết giỏ hàng**:
    *   **API**: `GET /v1/api/cart`
*   **Thêm sản phẩm vào giỏ hàng**:
    *   **API**: `POST /v1/api/cart`
    *   **Payload**:
        ```json
        {
          "product": {
            "productId": "64b73...",
            "quantity": 2,
            "name": "Tên sản phẩm",
            "price": 150
          }
        }
        ```
*   **Cập nhật số lượng sản phẩm trong giỏ**:
    *   **API**: `POST /v1/api/cart/update`
    *   **Payload**:
        ```json
        {
          "shop_order_ids": [
            {
              "shopId": "64b71...",
              "item_products": [
                {
                  "productId": "64b73...",
                  "quantity": 3,
                  "old_quantity": 2
                }
              ]
            }
          ]
        }
        ```
*   **Xóa sản phẩm khỏi giỏ hàng**:
    *   **API**: `DELETE /v1/api/cart`
    *   **Payload**: `{"productId": "64b73..."}`

#### C. Quy trình đặt hàng & Thanh toán (Yêu cầu Authentication)
*   **Tính toán thử giá trị đơn hàng (Review Checkout)**: Xem trước tổng tiền, phí vận chuyển và số tiền giảm giá được áp dụng.
    *   **API**: `POST /v1/api/checkout/review`
    *   **Payload**:
        ```json
        {
          "cartId": "64b78...",
          "userId": "64b71...",
          "shop_order_ids": [
            {
              "shopId": "64b71...",
              "shop_discounts": [
                {
                  "codeId": "DISCOUNT_CODE",
                  "shopId": "64b71..."
                }
              ],
              "item_products": [
                {
                  "price": 100,
                  "quantity": 2,
                  "productId": "64b73..."
                }
              ]
            }
          ]
        }
        ```
*   **Đặt mua sản phẩm (Create Order)**:
    *   **API**: `POST /v1/api/order`
    *   **Payload**:
        ```json
        {
          "cartId": "64b78...",
          "shop_order_ids": [...], // Cấu trúc tương tự phần Review
          "user_address": {
            "street": "123 Đường ABC",
            "city": "Hồ Chí Minh",
            "state": "Q1",
            "country": "Vietnam"
          },
          "user_payment": {
            "payment_method": "cod",
            "payment_status": "pending"
          }
        }
        ```
*   **Xem lịch sử đơn hàng**: `GET /v1/api/order`
*   **Xem chi tiết một đơn hàng**: `GET /v1/api/order/:orderId`
*   **Hủy đơn hàng**: `POST /v1/api/order/cancel/:orderId`

### 2.2. Các màn hình cần phát triển trên Giao diện Web
1.  **Trang chủ (Home)**: Slider banner, danh mục sản phẩm, sản phẩm nổi bật/bán chạy, thanh tìm kiếm.
2.  **Trang tìm kiếm/danh mục**: Hiển thị lưới sản phẩm kèm theo bộ lọc giá, sắp xếp theo thời gian (`ctime`).
3.  **Trang chi tiết sản phẩm**: Hiển thị thuộc tính động (nếu là `Clothing`: hiển thị size, chất liệu; nếu là `Electronic`: hiển thị hãng sản xuất, màu sắc, model), hiển thị danh sách giảm giá khả dụng của shop.
4.  **Trang giỏ hàng**: Tăng/giảm số lượng sản phẩm, hiển thị giá tạm tính, chọn và áp dụng mã giảm giá.
5.  **Trang Checkout**: Nhập thông tin địa chỉ giao hàng, hiển thị tóm tắt đơn hàng (Review) bao gồm phí ship và tiền giảm giá, chọn phương thức thanh toán.
6.  **Trang tài khoản**: Xem danh sách đơn hàng đã mua, trạng thái đơn hàng (Chờ duyệt, Đang giao, Đã giao, Đã hủy).

---

## 3. Hướng dẫn tích hợp Giao diện CMS (Merchant Dashboard)

Giao diện CMS dành cho các **Shop/Seller** quản lý cửa hàng của mình.

### 3.1. Danh sách luồng xử lý chính & API tương ứng

#### A. Xác thực và Phân quyền tài khoản
*   **Đăng ký tài khoản Shop**: `POST /v1/api/shop/signup` (Payload: `name`, `email`, `password`)
*   **Đăng nhập tài khoản Shop**: `POST /v1/api/shop/login`
*   **Đăng xuất**: `POST /v1/api/shop/logout` (Cần Headers Auth)
*   **Xoay vòng làm mới Token**: `POST /v1/api/shop/handlerRefreshToken`

#### B. Quản lý Sản phẩm (Được bảo vệ bởi Middleware Auth)
*   **Xem toàn bộ sản phẩm Nháp (Draft)**: `GET /v1/api/product/drafts/all`
*   **Xem toàn bộ sản phẩm Đã Đăng (Published)**: `GET /v1/api/product/published/all`
*   **Tạo mới sản phẩm**:
    *   **API**: `POST /v1/api/product`
    *   **Payload (với sản phẩm Clothing)**:
        ```json
        {
          "product_name": "Áo Thun Oversize",
          "product_thumb": "http://image-url...",
          "product_description": "Áo chất liệu cotton thoáng mát",
          "product_price": 20,
          "product_quantity": 100,
          "product_type": "Clothing",
          "product_attributes": {
            "brand": "Uniqlo",
            "size": "L",
            "material": "Cotton"
          }
        }
        ```
*   **Cập nhật thông tin sản phẩm**:
    *   **API**: `PATCH /v1/api/product/:productId`
    *   **Payload**: *(Truyền các trường cần cập nhật, hệ thống tự động gộp dữ liệu lồng ghép lồng nhau nhờ helper)*.
*   **Đăng bán sản phẩm (Publish)**: `POST /v1/api/product/publish/:id`
*   **Gỡ sản phẩm xuống (Unpublish)**: `POST /v1/api/product/unPublish/:id`

#### C. Quản lý mã giảm giá (Discount Builder)
*   **Tạo mã giảm giá mới**:
    *   **API**: `POST /v1/api/discount`
    *   **Payload**:
        ```json
        {
          "code": "SALE30",
          "start_date": "2026-08-01",
          "end_date": "2026-08-10",
          "is_active": true,
          "shopId": "SHOP_ID",
          "min_order_value": 50,
          "applies_to": "all",
          "name": "Giảm giá hè",
          "description": "Giảm 10$ cho đơn từ 50$",
          "type": "fixed_amount",
          "value": 10,
          "max_uses": 100,
          "max_uses_per_user": 1
        }
        ```
*   **Cập nhật mã giảm giá**: `PATCH /v1/api/discount`
*   **Xem tất cả mã giảm giá của Shop**: `GET /v1/api/discount`
*   **Xóa mã giảm giá**: `DELETE /v1/api/discount/:codeId`

#### D. Xử lý đơn hàng của khách hàng mua tại Shop
*   **Cập nhật trạng thái đơn hàng (Duyệt đơn/Giao hàng/Đã giao)**:
    *   **API**: `PATCH /v1/api/order/status`
    *   **Payload**: `{"orderId": "64b78...", "status": "confirmed"}` (Các trạng thái: `confirmed`, `shipped`, `delivered`, `cancelled`)

### 3.2. Các màn hình cần phát triển trên Giao diện CMS
1.  **Màn hình Login/Register**: Giao diện đăng nhập/đăng ký riêng cho Merchant.
2.  **Màn hình Dashboard (Trang tổng quan)**: Hiển thị nhanh các chỉ số (Tổng số sản phẩm nháp, sản phẩm đang bán, tổng số đơn hàng cần duyệt).
3.  **Trang Quản lý Sản phẩm**:
    *   Bảng liệt kê sản phẩm (phân tab Nháp và Đang bán).
    *   Form tạo mới/chỉnh sửa sản phẩm: Form này cần thay đổi linh hoạt tùy theo việc người dùng chọn loại sản phẩm nào (ví dụ chọn `Clothing` hiển thị form nhập Size/Material, chọn `Electronic` hiển thị form nhập Color/Model/Manufacturer).
4.  **Trang Quản lý Discount**: Thiết lập mã giảm giá, giới hạn số lần sử dụng, mức giá tối thiểu của đơn hàng, thời gian hiệu lực.
5.  **Trang Quản lý Đơn hàng**: Danh sách đơn hàng mà khách hàng đã đặt chứa sản phẩm của shop. Cho phép cập nhật trạng thái đơn để khách hàng thấy được lộ trình giao nhận.

---

## 4. Các LỖI NGHIÊM TRỌNG đang tồn tại trong Backend cần sửa đổi ngay

Khi tiến hành kiểm tra kỹ mã nguồn của bạn, tôi phát hiện ra một số lỗi logic/cú pháp sẽ trực tiếp làm crash ứng dụng hoặc khiến API hoạt động không đúng mong đợi:

### Lỗi 1: Thiếu từ khóa `return` trong ProductFactory (Dữ liệu trả về luôn là `undefined`)
*   **Tệp tin**: [product.service.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/services/product.service.js#L53-L73)
*   **Chi tiết lỗi**: Các hàm truy vấn như `findAllDraftForShop`, `findAllPublishedForShop`, `searchProducts`, `findAllProducts`, và `findProduct` gọi các phương thức repository bất đồng bộ nhưng lại không có từ khóa `return`. Kết quả là controller sẽ nhận giá trị `undefined`.
*   **Khắc phục**: Thêm `return` trước khi gọi repository. Ví dụ:
    ```javascript
    static findAllDraftForShop = async ({ product_shop, limit = 50, skip = 0 }) => {
        const query = { product_shop, isDraft: true }
        return await findAllDraftForShop({ query, limit, skip }) // Thêm return
    }
    ```

### Lỗi 2: Lỗi Destructure import trong `inventory.repo.js` (Crash ứng dụng khi tạo sản phẩm)
*   **Tệp tin**: [inventory.repo.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/models/repositories/inventory.repo.js#L2)
*   **Chi tiết lỗi**: `inventory.model.js` export trực tiếp model: `module.exports = model(DOCUMENT_NAME, inventorySchema);`. Tuy nhiên, trong file repo bạn lại khai báo `const { inventoryModel } = require("../inventory.model")`. Điều này khiến `inventoryModel` bị `undefined` và ứng dụng sẽ crash khi chạy hàm `.create()` hoặc `.updateOne()`.
*   **Khắc phục**: Sửa thành:
    ```javascript
    const inventoryModel = require("../inventory.model")
    ```

### Lỗi 3: Khởi tạo `ObjectId` không có từ khóa `new` trên Mongoose v9.x (Gây crash API)
*   **Tệp tin**: [utils/index.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/utils/index.js#L3) và [keyToken.servcie.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/services/keyToken.servcie.js#L26)
*   **Chi tiết lỗi**: Hàm `convertToObjectIdMongodb = id => Types.ObjectId(id)` và trong service `Types.ObjectId(userId)` được gọi trực tiếp. Từ Mongoose v6+, đặc biệt là v9.x hiện tại trong dự án của bạn (`mongoose: ^9.7.3`), `Types.ObjectId` là một constructor lớp và bắt buộc phải gọi kèm từ khóa `new`. Việc gọi thiếu sẽ gây ra lỗi `Class constructor ObjectId cannot be invoked without 'new'`.
*   **Khắc phục**: Sửa thành:
    ```javascript
    const convertToObjectIdMongodb = id => new Types.ObjectId(id)
    ```

### Lỗi 4: Sai tên trường truy vấn trong `keyToken.servcie.js`
*   **Tệp tin**: [keyToken.servcie.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/services/keyToken.servcie.js#L17)
*   **Chi tiết lỗi**: Câu lệnh `const filter = { user: userId }` sử dụng trường `user`. Trong khi đó, schema thực tế được định nghĩa trong [keyToken.model.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/models/keyToken.model.js#L5) là `userId`. Việc này khiến việc truy vấn xoay vòng token không khớp và không lưu/refresh key chính xác.
*   **Khắc phục**: Sửa filter thành:
    ```javascript
    const filter = { userId: userId }
    ```

### Lỗi 5: Sử dụng hàm `.remove()` đã bị khai tử của Mongoose
*   **Tệp tin**: [keyToken.servcie.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/services/keyToken.servcie.js#L30)
*   **Chi tiết lỗi**: Phương thức `return await keyTokenModel.remove(id);` gọi `.remove()`. Phương thức này đã bị gỡ bỏ hoàn toàn khỏi các phiên bản Mongoose mới (thay vào đó phải dùng `deleteOne` hoặc `deleteMany`). Gọi hàm này sẽ ném ra lỗi `TypeError: keyTokenModel.remove is not a function`.
*   **Khắc phục**: Sửa thành:
    ```javascript
    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({ _id: id });
    }
    ```

### Lỗi 6: Truyền sai tham số tìm kiếm tại Product Controller (Lỗi Regex)
*   **Tệp tin**: [product.controller.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/controllers/product.controller.js#L70)
*   **Chi tiết lỗi**: Hàm `getListSearchProduct` truyền `keySearch: req.params`. Do `req.params` là một object `{ keySearch: "..." }`, việc truyền trực tiếp này làm cho hàm nhận dạng `keySearch` nhận vào cả object. Khi repo biên dịch sang Regex: `new RegExp(keySearch)` nó sẽ tìm kiếm chuỗi `"[object Object]"` thay vì giá trị chuỗi thực tế.
*   **Khắc phục**: Sửa dòng 70 thành:
    ```javascript
    metaData: await ProductService.searchProducts({
        keySearch: req.params.keySearch
    })
    ```

### Lỗi 7: Gọi sai biến dạng hàm và gọi hàm chưa định nghĩa trong `CheckoutService.orderByUser`
*   **Tệp tin**: [checkout.service.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/services/checkout.service.js#L98) và [checkout.service.js](file:///Users/macbookpro2020/Backend-Ecomerce/src/services/checkout.service.js#L109)
*   **Chi tiết lỗi**:
    1.  Dòng 94 khai báo `const acquireLockProduct = [];` là một mảng nhưng dòng 98 lại gọi nó dưới dạng hàm: `acquireLockProduct(keyLock ? true : false);`. Lỗi này sẽ ném ra `TypeError: acquireLockProduct is not a function`.
    2.  Dòng 109 gọi `const newOrder = await create();` nhưng hàm `create` không được khai báo hay import từ đâu trong file này. Trong khi đó, `OrderService.orderByUser` lại đang làm nhiệm vụ tạo đơn hàng thực tế.
*   **Khắc phục**: Cần chỉnh sửa lại logic lock hoặc xóa bỏ hàm `orderByUser` trùng lặp trong `checkout.service.js` để tránh nhầm lẫn với hàm hoạt động tốt ở `order.service.js`.

---

## 5. Đề xuất các tính năng còn thiếu và giải pháp bổ sung để hoàn thiện ứng dụng

Dưới đây là các phần cực kỳ quan trọng cần được xây dựng để hệ thống này có thể hoạt động hoàn chỉnh ở môi trường thực tế:

### 5.1. Phân tách thực thể Khách hàng (User/Customer Model & Auth)
*   **Hiện trạng**: Chỉ có mô hình `Shop` đại diện cho cả việc đăng nhập mua hàng lẫn bán hàng. Dữ liệu đơn hàng (`order_userId`) lại tham chiếu đến `Shop`.
*   **Khuyến nghị**:
    *   Tạo mới một file `user.model.js` để quản lý thông tin khách hàng (bao gồm tên, email, password, số điện thoại, danh sách địa chỉ nhận hàng).
    *   Xây dựng API đăng nhập/đăng ký cho khách hàng riêng biệt.
    *   Trong JWT Payload, đính kèm vai trò (`role: 'customer'` hoặc `role: 'shop'`) để phân biệt quyền truy cập vào các router quản trị CMS và mua hàng.

### 5.2. Bổ sung loại sản phẩm "Furniture" (Đồ nội thất)
*   **Hiện trạng**: Trường `product_type` trong schema chấp nhận `Funiture` (đang viết sai chính tả, nên sửa thành `Furniture`), nhưng trong service chưa hề khai báo Class `Furniture` cũng như chưa đăng ký kiểu sản phẩm này với `ProductFactory`.
*   **Khuyến nghị**: Tạo lớp `Furniture extends Product` tương tự như `Clothing` và `Electronic`, định nghĩa schema riêng cho đồ nội thất (ví dụ: kích thước, màu sắc, chất liệu gỗ, loại phòng) và đăng ký qua `ProductFactory.registerProductType('Furniture', Furniture)`.

### 5.3. Tích hợp cổng thanh toán trực tuyến (Online Payment Gateway)
*   **Hiện trạng**: Trường thanh toán `order_payment` chỉ đang lưu trữ dưới dạng text giả định (`cod`, `paypal`).
*   **Khuyến nghị**: Tích hợp các SDK chính thức để tạo liên kết thanh toán:
    *   **Stripe / PayPal API**: Dành cho thanh toán quốc tế bằng thẻ tín dụng.
    *   **VNPay / MoMo API**: Dành cho thị trường Việt Nam (Thanh toán qua ví điện tử hoặc quét mã QR ngân hàng).
    *   *Quy trình*: Khi đặt hàng, server gọi API cổng thanh toán tạo một phiên giao dịch (Payment Session) và trả về URL thanh toán cho Frontend. Sau khi khách hàng thanh toán xong, Webhook của cổng thanh toán sẽ gọi về API Backend của bạn để cập nhật trạng thái đơn hàng sang `paid`.

### 5.4. API Tải lên hình ảnh/tệp tin (Upload Media API)
*   **Hiện trạng**: Trường ảnh sản phẩm (`product_thumb`) yêu cầu một đường dẫn dạng URL, nhưng hệ thống chưa có API để người dùng tải ảnh từ máy lên.
*   **Khuyến nghị**:
    *   Cài đặt thư viện `multer` để xử lý tải tệp tin từ client.
    *   Kết nối với dịch vụ lưu trữ đám mây như **Cloudinary** hoặc **Amazon S3** để lưu trữ hình ảnh sản phẩm lâu dài và tối ưu hóa băng thông tải trang.

### 5.5. Hệ thống Đánh giá & Bình luận (Rating & Review System)
*   **Hiện trạng**: Mặc dù schema của sản phẩm có thuộc tính `product_ratingsAverage` (mặc định 4.5), nhưng chưa có bảng lưu trữ đánh giá chi tiết của người dùng.
*   **Khuyến nghị**:
    *   Tạo model `Review` liên kết `productId`, `userId`, `rating` (1-5 sao) và `comment`.
    *   Xây dựng API cho phép người dùng viết đánh giá sau khi đơn hàng chuyển sang trạng thái `delivered` (đã giao hàng thành công).
    *   Viết middleware trigger tự động tính toán lại điểm trung bình đánh giá (`product_ratingsAverage`) mỗi khi có đánh giá mới.

### 5.6. Tích hợp đơn vị vận chuyển & tính toán phí Ship tự động
*   **Hiện trạng**: Phí giao hàng hiện tại đang được tính bằng mã giả đơn giản: `priceRaw > 100 ? 0 : 10`.
*   **Khuyến nghị**: Kết nối với API của các đơn vị giao hàng như **Giao Hàng Nhanh (GHN)** hoặc **Giao Hàng Tiết Kiệm (GHTK)** để lấy danh sách tỉnh/thành phố, quận/huyện và tự động tính toán phí vận chuyển dựa trên khoảng cách và trọng lượng của sản phẩm.

### 5.7. Xây dựng API thống kê phân tích (Analytics & Reports) cho CMS
*   **Hiện trạng**: Chưa có API thống kê nào phục vụ cho giao diện quản trị của merchant.
*   **Khuyến nghị**: Viết các API tổng hợp dữ liệu (sử dụng MongoDB Aggregation) để phục vụ vẽ biểu đồ ở CMS:
    *   Thống kê doanh thu theo ngày/tháng/năm.
    *   Top 5 sản phẩm bán chạy nhất của shop.
    *   Tỷ lệ đơn hàng thành công/đơn hàng bị hủy.
    *   Tổng số mã giảm giá đã được khách hàng sử dụng.
