## 🎨 OCR-Translate-PDF Frontend

Giao diện web cho phép người dùng tải lên ảnh chứa văn bản tiếng Anh và nhận lại file PDF đã được dịch sang tiếng Việt. Frontend kết nối với hệ thống backend theo kiến trúc microservice, giao tiếp thông qua RESTful API.

---

## 🧠 Chức năng chính

- Giao diện thân thiện cho phép người dùng:
  - Tải lên ảnh (JPEG, PNG)
  - Gửi yêu cầu xử lý ảnh
  - Tải xuống file PDF đầu ra

- Hiển thị trạng thái xử lý:
  - Đang tải ảnh
  - Đang thực hiện OCR / dịch thuật / tạo PDF
  - Thông báo lỗi nếu có

---

## ⚙️ Hướng dẫn cài đặt

### Yêu cầu:

- Node.js và npm đã được cài đặt
- Đảm bảo backend đã hoạt động (RESTful API)

### Cài đặt và khởi chạy:

```bash
# Cài đặt các gói phụ thuộc
$ npm install

# Khởi chạy frontend (mặc định ở http://localhost:3000)
$ npm start
```


## 🔗 Liên kết với Backend

- Frontend gọi đến API của backend tại các endpoint như:

  - `POST /upload`: Tải ảnh lên và bắt đầu quá trình xử lý

---


