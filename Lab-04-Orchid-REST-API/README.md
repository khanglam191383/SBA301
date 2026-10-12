# SBA301 Slot 18 Lab 04 — Orchid REST API & JPA Integration Kit

Spring Boot 3.x REST API tích hợp Spring Data JPA và Microsoft SQL Server quản lý danh mục hoa lan (`Orchid` và `OrchidCategory`).

---

## 1. Cấu Trúc Dự Án (Project Structure)

```
d:\SBA301\lab-04\
├── docs/
│   ├── api-contract.md        # Đặc tả chi tiết các endpoint REST API & status codes
│   ├── concept-trace.md       # Luồng request-to-database, JPA mapping, 20 câu hỏi V-Gate & Oral exam
│   └── test-matrix.md         # Bảng kiểm thử T01–T12 & phân tích lỗi Break-It (B1–B8)
├── evidence/
│   ├── console/               # Kết quả response JSON & logs chạy kiểm thử T01–T12
│   ├── postman/
│   │   └── SBA301_Slot18_Orchid_API.postman_collection.json  # Postman collection sẵn sàng import
│   └── sqlserver/
│       ├── schema_evidence.txt # Chứng minh DDL, tables, columns, foreign keys
│       └── seed_evidence.txt   # Dữ liệu seed OrchidCategory
├── src/
│   ├── main/
│   │   ├── java/com/example/orchid/
│   │   │   ├── OrchidApplication.java
│   │   │   ├── controllers/OrchidController.java
│   │   │   ├── pojos/Orchid.java
│   │   │   ├── pojos/OrchidCategory.java
│   │   │   ├── repositories/IOrchidCategoryRepository.java
│   │   │   ├── repositories/IOrchidRepository.java
│   │   │   ├── services/IOrchidService.java
│   │   │   └── services/OrchidService.java
│   │   └── resources/application.properties
│   └── test/
│       ├── java/com/example/orchid/
│       │   ├── OrchidApplicationTests.java
│       │   └── OrchidControllerIntegrationTests.java
│       └── resources/application.properties
├── pom.xml
├── mvnw / mvnw.cmd
└── README.md
```

---

## 2. Yêu Cầu Môi Trường (Prerequisites)

- **JDK:** Java 21 LTS
- **Database:** Microsoft SQL Server (Local, TCP/IP Port 1433)
  - Database: `OrchidDB`
  - User: `sa`
  - Password: `YOUR_PASSWORD` (Cấu hình trong `src/main/resources/application.properties`)
- **Maven:** Đi kèm sẵn Maven Wrapper (`mvnw.cmd`)

---

## 3. Cấu Hình Cơ Sở Dữ Liệu (`application.properties`)

```properties
spring.application.name=slot18-orchid-lab
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=OrchidDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=123456
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
server.port=8080
```

---

## 4. Hướng Dẫn Chạy Ứng Dụng (How to Run)

### 4.1. Chạy Unit/Integration Tests
Chạy toàn bộ 10 integration test MockMvc và context load:
```powershell
.\mvnw.cmd clean test
```

### 4.2. Khởi Động Backend Server
Khởi động ứng dụng Spring Boot:
```powershell
.\mvnw.cmd spring-boot:run
```
Ứng dụng sẽ tự động kết nối vào `OrchidDB`, khởi tạo các bảng `orchid_categories` và `orchids` với foreign key `category_id`.

### 4.3. Seed Dữ Liệu Ban Đầu
Có thể chạy script PowerShell đi kèm:
```powershell
powershell -ExecutionPolicy Bypass -File verify_db_schema.ps1
```
Hoặc chạy trực tiếp trên SSMS:
```sql
USE OrchidDB;
INSERT INTO orchid_categories (category_name) VALUES ('Cattleya'), ('Dendrobium');
```

### 4.4. Chạy Toàn Bộ Test Suite T01 – T12
Trong khi server đang chạy ở port 8080, mở terminal mới và thực thi:
```powershell
powershell -ExecutionPolicy Bypass -File run_live_crud_tests.ps1
```

---

## 5. Danh Sách Endpoint REST API

| Method | Endpoint | Mô tả | Expected Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/orchids` | Danh sách hoa lan | `200 OK` |
| `GET` | `/api/orchids?name={keyword}` | Tìm kiếm hoa lan theo từ khóa | `200 OK` |
| `GET` | `/api/orchids/{id}` | Lấy thông tin hoa lan theo ID | `200 OK` hoặc `404 Not Found` |
| `POST` | `/api/orchids` | Tạo mới hoa lan (yêu cầu category hợp lệ) | `201 Created` hoặc `400 Bad Request` |
| `PUT` | `/api/orchids/{id}` | Cập nhật hoa lan | `200 OK`, `400 Bad Request`, `404 Not Found` |
| `DELETE`| `/api/orchids/{id}` | Xóa hoa lan | `204 No Content` hoặc `404 Not Found` |

---

## 6. Kiểm Thử Postman

File collection đã được tạo sẵn tại:
`evidence/postman/SBA301_Slot18_Orchid_API.postman_collection.json`
- Mở Postman -> Chọn **Import** -> Chọn file trên.
- Đảm bảo biến `baseUrl` là `http://localhost:8080`.
- Chạy lần lượt từ `T01` đến `T10` để quan sát request/response thực tế.

---

## 7. Tài Liệu Hướng Dẫn & Phỏng Vấn (Oral Exam)

- Xem đặc tả API tại: [`docs/api-contract.md`](docs/api-contract.md)
- Xem bảng ma trận kiểm thử và phân tích lỗi Break-It tại: [`docs/test-matrix.md`](docs/test-matrix.md)
- Xem luồng request-to-database và 20 câu hỏi sát hạch tại: [`docs/concept-trace.md`](docs/concept-trace.md)
