# FUNewsManagementSystem - Assignment 02 (SBA301)
> **Full-Stack CRUD Application with Spring Boot 3 RESTful Web Service & ReactJS SPA**

* **Sinh viên thực hiện:** Lâm Hoàng Khang
* **Mã sinh viên:** CE191383
* **Lớp:** SE1910
* **Môn học:** SBA301 – Java Web & Component-Based Development
* **Repository:** [khanglam191383/SBA301](https://github.com/khanglam191383/SBA301)

---

## 1. Giới thiệu tổng quan (Overview)

Dự án **FUNewsManagementSystem (Assignment 02)** là hệ thống quản lý tin tức hoàn chỉnh của Đại học FPT, kết hợp kiến trúc 3 lớp (**3-Layer Architecture**) chuẩn doanh nghiệp giữa:
1. **Backend:** Spring Boot 3 RESTful API, Spring Data JPA, Spring Security (Stateless JWT), Hibernate, và cơ sở dữ liệu Microsoft SQL Server.
2. **Frontend:** Single Page Application (SPA) phát triển bằng ReactJS 19, Vite 8, Axios HTTP Client, Modern CSS Design System (Zero external heavy CSS frameworks).

Hệ thống hỗ trợ phân quyền người dùng (Role-Based Access Control - RBAC) nghiêm ngặt theo đúng yêu cầu đề bài:
* **Khách vãng lai (Public Visitor):** Xem danh sách và chi tiết các bài viết tin tức có trạng thái `Active` mà không cần đăng nhập.
* **Quản trị viên (Admin - Role 1):** Quản lý tài khoản hệ thống (CRUD & Search Account). Không thể xóa tài khoản đã từng tạo bài viết (Foreign Key Constraint Rule).
* **Nhân viên / Biên tập viên (Staff - Role 2):**
  * Quản lý danh mục tin tức (CRUD & Search Category). Không thể xóa danh mục đang có bài viết liên kết.
  * Quản lý bài viết tin tức và gắn thẻ bài viết (CRUD & Search NewsArticle, Tags).
  * Quản lý hồ sơ cá nhân (Update Profile & Password).
  * Xem lịch sử bài viết do chính tài khoản tạo (My News History).

---

## 2. Cấu trúc thư mục (Project Structure)

```text
Assignment-02/
├── backend/                                # Spring Boot 3.4.x REST API Project
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/fu/se/a2/
│   │   │   │   ├── config/                # DataInitializer, SecurityConfig, CorsConfig
│   │   │   │   ├── controllers/           # Auth, Account, Category, News, Profile, Public Controllers
│   │   │   │   ├── dtos/                  # Request/Response DTOs with Bean Validation
│   │   │   │   ├── entities/              # SystemAccount, Category, NewsArticle, Tag (JPA Entities)
│   │   │   │   ├── exceptions/            # Custom Exceptions & GlobalExceptionHandler (@RestControllerAdvice)
│   │   │   │   ├── repositories/          # Spring Data JPA Repositories
│   │   │   │   ├── security/              # JwtTokenProvider, JwtAuthenticationFilter, CustomUserDetails
│   │   │   │   └── services/              # Business Logic Services with business constraint rules
│   │   │   └── resources/
│   │   │       └── application.properties # SQL Server & JWT Configurations
│   │   └── test/                          # Unit & MockMvc Integration Tests
│   └── pom.xml                            # Maven dependencies (Web, Data JPA, Security, JJWT, MSSQL)
├── frontend/                               # ReactJS 19 SPA + Vite
│   ├── public/                            # Static assets & AI-generated logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                      # LoginPage (JWT auth with Email/Password)
│   │   │   ├── categories/                # CategoryManagement (CRUD, Modal Popup, Confirm Dialog)
│   │   │   ├── common/                    # Modal, ConfirmDialog, Toast, Icons
│   │   │   ├── dashboard/                 # Realtime Dashboard & Category Distribution
│   │   │   ├── layout/                    # Header, Sidebar (Role-filtered navigation), AdminLayout
│   │   │   ├── news/                      # NewsManagement, MyNewsHistory
│   │   │   ├── public/                    # PublicNewsPortal (Open news portal for guests)
│   │   │   ├── settings/                  # Profile & Password management
│   │   │   └── users/                     # UserManagement (Admin Account CRUD & Search)
│   │   ├── services/
│   │   │   ├── api.js                     # Centralized Axios instance with JWT Interceptor & 401 handler
│   │   │   ├── authService.js             # Authentication API service
│   │   │   ├── accountService.js          # Account CRUD API service
│   │   │   ├── categoryService.js        # Category CRUD API service
│   │   │   └── newsService.js            # News CRUD API service
│   │   ├── App.jsx                        # State orchestrator, RBAC routing & auth guard
│   │   └── index.css                      # Design tokens & responsive styles
│   ├── package.json
│   └── vite.config.js
├── Assignment 02_Implement CRUD Application with RESTful Web Service and ReactJS.md
├── NOTES.md                               # Design decisions, ERD resolutions & naming conventions
└── PLAN.md                                # Implementation roadmap & checklist
```

---

## 3. Hướng dẫn khởi chạy (Getting Started)

### 3.1 Khởi chạy Backend (Spring Boot 3)
1. Cấu hình cơ sở dữ liệu trong `backend/src/main/resources/application.properties` (mặc định MS SQL Server tại `localhost:1433`, database `A2KhangLH_SE1910`).
2. Mở terminal tại thư mục `backend/`:
   ```bash
   mvn clean spring-boot:run
   ```
   * REST API sẽ khởi động tại: `http://localhost:8080/api`
   * Dữ liệu mẫu ban đầu sẽ được nạp tự động qua `DataInitializer`.

### 3.2 Khởi chạy Frontend (ReactJS + Vite)
1. Mở terminal tại thư mục `frontend/`:
   ```bash
   npm install
   npm run dev
   ```
2. Mở trình duyệt tại: `http://localhost:5173/`

---

## 4. Tài khoản kiểm thử (Test Credentials)

| Role | Email / Username | Password | Quyền hạn |
|---|---|---|---|
| **Administrator** | `admin.funews@fpt.edu.vn` (`Admin`) | `Admin` | Quản trị tài khoản (CRUD Account), xem Dashboard tổng quan |
| **Staff Member** | `staff01@funews.edu.vn` (`staff01`) | `Password123` | Quản lý Category, News Article, Tags, Profile, News History |
| **Staff Editor** | `tranthib.editor@fpt.edu.vn` (`editor02`) | `Password123` | Biên tập tin tức, cập nhật bài viết |
| **Public Guest** | *(Không cần đăng nhập)* | *(None)* | Xem danh sách và chi tiết các bài viết `Active` |

---

## 5. Các ràng buộc nghiệp vụ chính (Business Rules Complied)
* **Delete Account Rule:** Quản trị viên không thể xóa một tài khoản nếu tài khoản đó đã từng đăng bài viết (Trả về `409 Conflict` kèm thông báo rõ ràng).
* **Delete Category Rule:** Biên tập viên không thể xóa một danh mục nếu có bất kỳ bài viết nào đang thuộc về danh mục đó (Trả về `409 Conflict`).
* **Popup & Confirmation:** Toàn bộ tác vụ Create / Update được xử lý bằng Modal Dialog popup; Tác vụ Delete luôn đi kèm hộp thoại Confirm Dialog xác nhận.
* **Security & Auth:** Mã hóa mật khẩu bằng BCrypt, truyền tải token JWT qua Header `Authorization: Bearer <token>`, bảo vệ route theo vai trò.
