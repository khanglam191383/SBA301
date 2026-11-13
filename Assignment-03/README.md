# BÁO CÁO & HƯỚNG DẪN THỰC HIỆN ASSIGNMENT 03 (SBA301)
## SECURING REST SERVICES WITH SPRING BOOT & REACTJS

- **Họ và tên sinh viên:** Lâm Hoàng Khang
- **Mã số sinh viên (MSSV):** CE191383
- **Môn học:** SBA301 - Java Spring Boot & React RESTful Web Services
- **Database:** `A3KhangLH_CE191383` (Microsoft SQL Server)
- **Backend Project:** `A3KhangLH_CE191383_BE` (Spring Boot 3 + Spring Data JPA + Spring Security + JWT)
- **Frontend Project:** `A3KhangLH_CE191383_FE` (ReactJS + Vite + Axios + Bootstrap 5)

---

## 1. TỔNG QUAN CẤU TRÚC DỰ ÁN

```text
ASSIGNMENT_3/
├── A3KhangLH_CE191383_Database.sql         # Script tạo Database & nạp dữ liệu mẫu
├── Assignment 02_FUMiniHotelManagement.sql  # File SQL gốc của đề bài
├── Assignment 03_Securing REST Services with Spring Boot.pdf # Đề bài
├── README.md                               # Hướng dẫn chi tiết & báo cáo
│
├── A3KhangLH_CE191383_BE/                  # DỰ ÁN BACKEND (Spring Boot 3)
│   ├── pom.xml                             # Cấu hình Spring Boot 3.4.1, Security, JWT, MSSQL
│   └── src/main/
│       ├── resources/
│       │   └── application.properties      # Cấu hình DB, JWT Secret, Tài khoản Staff
│       └── java/vn/edu/fpt/
│           ├── A3KhangBackendApplication.java
│           ├── entity/                     # Thực thể JPA (5 thực thể theo đúng schema)
│           │   ├── Customer.java
│           │   ├── RoomType.java
│           │   ├── RoomInformation.java
│           │   ├── BookingReservation.java
│           │   ├── BookingDetail.java
│           │   └── BookingDetailId.java
│           ├── repositories/               # Tầng dữ liệu Spring Data JPA
│           │   ├── ICustomerRepository.java
│           │   ├── IRoomTypeRepository.java
│           │   ├── IRoomInformationRepository.java
│           │   ├── IBookingReservationRepository.java
│           │   └── IBookingDetailRepository.java
│           ├── security/                   # Tầng bảo mật & JWT
│           │   ├── JwtUtils.java
│           │   ├── JwtAuthenticationFilter.java
│           │   └── SecurityConfig.java
│           ├── dtos/                       # Data Transfer Objects
│           │   ├── LoginRequest.java
│           │   ├── RegisterRequest.java
│           │   ├── AuthResponse.java
│           │   ├── CustomerRequest.java
│           │   ├── CustomerProfileRequest.java
│           │   ├── RoomRequest.java
│           │   ├── BookingCreateRequest.java
│           │   └── MessageResponse.java
│           ├── services/                   # Tầng nghiệp vụ (Service Interfaces & Implementations)
│           │   ├── IAuthService.java & AuthService.java
│           │   ├── ICustomerService.java & CustomerService.java
│           │   ├── IRoomService.java & RoomService.java
│           │   ├── IRoomTypeService.java & RoomTypeService.java
│           │   └── IBookingService.java & BookingService.java
│           └── controllers/                # Tầng RESTful Web Service Controllers
│               ├── AuthController.java
│               ├── RoomController.java
│               ├── RoomTypeController.java
│               ├── CustomerController.java
│               └── BookingController.java
│
└── A3KhangLH_CE191383_FE/                  # DỰ ÁN FRONTEND (ReactJS)
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── styles/app.css
        ├── services/api.js                 # Axios client tự động gắn JWT Bearer token
        ├── components/
        │   ├── Navbar.jsx                  # Menu điều hướng động theo vai trò (Guest/Customer/Staff)
        │   └── Footer.jsx
        └── views/
            ├── RoomsPublicView.jsx         # Khách vãng lai xem phòng công khai
            ├── LoginView.jsx               # Đăng nhập (có nút điền nhanh tài khoản test)
            ├── RegisterView.jsx            # Khách hàng đăng ký tài khoản
            ├── customer/
            │   ├── CustomerProfileView.jsx # Khách hàng xem & sửa thông tin cá nhân
            │   ├── CustomerBookRoomView.jsx# Đặt phòng online với 1 hoặc nhiều phòng
            │   └── CustomerBookingsView.jsx# Xem lịch sử đặt phòng & chi tiết đơn
            └── staff/
                ├── StaffRoomsView.jsx      # Quản lý phòng (CRUD + kiểm tra quy tắc xóa phòng)
                ├── StaffCustomersView.jsx  # Quản lý khách hàng (CRUD)
                └── StaffBookingsView.jsx   # Quản lý toàn bộ đặt phòng & đổi trạng thái
```

---

## 2. ĐỐI CHIẾU YÊU CẦU ĐỀ BÀI (CHECKLIST)

| Yêu cầu đề bài | Cách giải quyết trong dự án | Trạng thái |
| :--- | :--- | :---: |
| **1. Xem phòng không cần đăng nhập** | Endpoint `GET /api/rooms` được mở công khai (`permitAll()`). Khách vãng lai có thể lọc theo loại phòng, tìm kiếm theo tên/mô tả. | **ĐÃ HOÀN THÀNH** |
| **2. Xác thực Customer bằng Email & Password với JWT** | Endpoint `POST /api/auth/login`. Kiểm tra mật khẩu trong bảng `Customer`, sinh chuỗi JWT kèm thông tin `ROLE_CUSTOMER`. | **ĐÃ HOÀN THÀNH** |
| **3. Tài khoản Staff lấy từ `application.properties`** | Trong `application.properties`: <br>`admin.email=staff@fpt.edu.vn`<br>`admin.password=staff123`<br>`admin.fullname=FPT MiniHotel Staff`<br>Đăng nhập qua `POST /api/auth/login` sinh JWT kèm `ROLE_STAFF`. | **ĐÃ HOÀN THÀNH** |
| **4. Cơ sở dữ liệu & Tên đặt đúng quy định** | Database tên: `A3KhangLH_CE191383`. Đúng 5 bảng theo ERD đề bài. | **ĐÃ HOÀN THÀNH** |
| **5. Kiến trúc 3-Layer với Repository** | Phân tầng rõ rệt: `Controllers` $\to$ `Services` (Interface + Impl) $\to$ `Repositories` (Spring Data JPA) $\to$ `Entities`. | **ĐÃ HOÀN THÀNH** |
| **6. Chức năng Staff: Quản lý khách hàng** | Xem danh sách, tìm kiếm từ khóa, thêm mới, cập nhật thông tin, vô hiệu hóa tài khoản (`/api/customers/**`). | **ĐÃ HOÀN THÀNH** |
| **7. Chức năng Staff: Quản lý phòng & Quy tắc Xóa đặc biệt** | **Nghiệp vụ đề bài yêu cầu:** Nếu phòng chưa từng có giao dịch thuê thì XÓA VĨNH VIỄN; Nếu phòng đã từng nằm trong `BookingDetail` thì CHUYỂN TRẠNG THÁI sang `Inactive` (soft delete) để bảo toàn dữ liệu lịch sử. <br>$\to$ Đã cài đặt kiểm tra `existsByRoomInformation_RoomID` tại `RoomService.java`. | **ĐÃ HOÀN THÀNH** |
| **8. Chức năng Staff: Quản lý đặt phòng** | Xem tất cả đơn đặt phòng của khách sạn, xem chi tiết các phòng trong đơn, cập nhật trạng thái đơn (Confirmed, Completed, Cancelled). | **ĐÃ HOÀN THÀNH** |
| **9. Chức năng Customer: Đăng ký tài khoản** | Form đăng ký tại giao diện gọi `POST /api/auth/register`, kiểm tra email trùng lặp, lưu vào database với status Active. | **ĐÃ HOÀN THÀNH** |
| **10. Chức năng Customer: Đặt phòng online với 1 hoặc nhiều phòng** | Giao diện chọn ngày Check-in/Check-out, cho phép chọn checkbox 1 hoặc nhiều phòng cùng lúc, tự tính tổng tiền real-time và tạo bản ghi `BookingReservation` kèm danh sách `BookingDetail`. | **ĐÃ HOÀN THÀNH** |
| **11. Chức năng Customer: Quản lý thông tin cá nhân** | `GET /api/customers/profile` và `PUT /api/customers/profile` cho phép xem và cập nhật họ tên, điện thoại, ngày sinh, mật khẩu mới. | **ĐÃ HOÀN THÀNH** |
| **12. Chức năng Customer: Xem lịch sử đặt phòng** | `GET /api/bookings/my-history` xem các đơn đặt phòng của chính mình kèm popup chi tiết từng phòng và giá tiền. | **ĐÃ HOÀN THÀNH** |
| **13. React Client dùng Axios** | Cấu hình trong `api.js`, tự động chèn `Authorization: Bearer <token>` vào mọi request qua Axios Request Interceptor. | **ĐÃ HOÀN THÀNH** |

---

## 3. THÔNG TIN TÀI KHOẢN DÙNG ĐỂ KIỂM THỬ

Trên giao diện Đăng nhập đã có sẵn 2 nút bấm tự động điền tài khoản:

### 1. Tài khoản Nhân viên (Staff):
- **Email:** `staff@fpt.edu.vn`
- **Mật khẩu:** `staff123`
- *Ghi chú:* Được cấu hình trong file `application.properties`.

### 2. Tài khoản Khách hàng (Customer) mẫu:
- **Email:** `customer@hotel.com`
- **Mật khẩu:** `123456`
- *Ghi chú:* Lưu trong cơ sở dữ liệu bảng `Customer` (ID = 1).
- Bạn cũng có thể bấm vào trang **Register** để tự tạo một tài khoản khách hàng mới.

---

## 4. HƯỚNG DẪN CHẠY DỰ ÁN

### Bước 1: Khởi tạo Cơ sở dữ liệu (SQL Server)
Mở SQL Server Management Studio (SSMS) hoặc chạy bằng lệnh:
```powershell
sqlcmd -S localhost,1433 -U sa -P 123 -i ".\ASSIGNMENT_3\A3KhangLH_CE191383_Database.sql"
```
*(Nếu mật khẩu sa của máy bạn khác 123, hãy cập nhật lại trong lệnh và trong file `application.properties`)*.

### Bước 2: Chạy Backend Spring Boot
Mở terminal tại thư mục `ASSIGNMENT_3/A3KhangLH_CE191383_BE` và chạy:
```powershell
mvn spring-boot:run
```
Backend sẽ khởi động tại địa chỉ: `http://localhost:8080`

### Bước 3: Chạy Frontend ReactJS
Mở terminal thứ hai tại thư mục `ASSIGNMENT_3/A3KhangLH_CE191383_FE` và chạy:
```powershell
npm install
npm run dev
```
Truy cập ứng dụng trên trình duyệt tại: `http://localhost:5173`

---

## 5. MINH CHỨNG KIỂM TRA QUY TẮC XÓA PHÒNG ĐẶC BIỆT (STAFF)
- **Trường hợp 1:** Phòng số `101` đã có giao dịch thuê trong bảng `BookingDetail` (theo dữ liệu mẫu ban đầu).
  - Khi Staff bấm **Delete** phòng `101`: Hệ thống hiển thị thông báo:
    > *"Room has existing booking transactions. Status has been changed to Inactive (soft deleted)."*
    $\to$ Phòng 101 được chuyển sang trạng thái Ngưng hoạt động (ẩn khỏi trang người dùng công khai, không bị xóa mất dữ liệu hóa đơn).
- **Trường hợp 2:** Phòng số `401` chưa từng có giao dịch thuê nào.
  - Khi Staff bấm **Delete** phòng `401`: Hệ thống hiển thị thông báo:
    > *"Room was permanently deleted."*
    $\to$ Phòng 401 được xóa hoàn toàn khỏi cơ sở dữ liệu.

