# Test Matrix — Orchid REST API & JPA Integration Kit

## 1. Mandatory Test Cases (T01 – T12)

| Test ID | Mục tiêu kiểm thử | Preconditions | HTTP Request | Expected Result | Actual Result | Trạng thái | Bằng chứng (Evidence) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **T01** | GET collection | DB chạy, bảng rỗng hoặc có dữ liệu | `GET /api/orchids` | `200 OK` + JSON Array | `200 OK`, JSON Array | **PASS** | `evidence/console/T01.json` |
| **T02** | GET search by keyword | DB có record chứa "Queen" | `GET /api/orchids?name=Queen` | `200 OK` + mảng chỉ chứa hoa lan phù hợp | `200 OK`, mảng lọc chính xác | **PASS** | `evidence/console/T02.json` |
| **T03** | GET existing ID | Record ID vừa tạo tồn tại | `GET /api/orchids/{id}` | `200 OK` + JSON Object đầy đủ trường | `200 OK`, JSON Object | **PASS** | `evidence/console/T03.json` |
| **T04** | GET missing ID | ID `999999` không tồn tại | `GET /api/orchids/999999` | `404 Not Found` | `404 Not Found` | **PASS** | `evidence/console/T04.json` |
| **T05** | POST valid category | Category ID `1` đã tồn tại | `POST /api/orchids` + JSON body hợp lệ | `201 Created` + sinh `orchidID` + nested category | `201 Created`, orchidID sinh mới | **PASS** | `evidence/console/T05.json` |
| **T06** | POST invalid category | Category ID `99999` không tồn tại | `POST /api/orchids` + categoryId `99999` | `400 Bad Request` | `400 Bad Request` ("Category not found: 99999") | **PASS** | `evidence/console/T06.json` |
| **T07** | PUT existing ID | Record tồn tại, categoryId `2` tồn tại | `PUT /api/orchids/{id}` + full body | `200 OK` + trạng thái mới được cập nhật | `200 OK`, state cập nhật đầy đủ | **PASS** | `evidence/console/T07.json` |
| **T08** | PUT missing ID | ID `999999` không tồn tại | `PUT /api/orchids/999999` + JSON body | `404 Not Found` | `404 Not Found` | **PASS** | `evidence/console/T08.json` |
| **T09** | DELETE existing ID | Record tồn tại | `DELETE /api/orchids/{id}` | `204 No Content`, sau đó `GET` cùng ID trả `404` | `204 No Content`, GET sau DELETE trả `404` | **PASS** | `evidence/console/T09.json` |
| **T10** | DELETE missing ID | ID `999999` không tồn tại | `DELETE /api/orchids/999999` | `404 Not Found` | `404 Not Found` | **PASS** | `evidence/console/T10.json` |
| **T11** | DB verify FK | Sau PUT chuyển sang categoryId `2` | Truy vấn `SELECT category_id FROM orchids WHERE orchidid={id}` | `category_id = 2` trong SQL Server | `category_id = 2` | **PASS** | `evidence/console/T11.json`, `evidence/sqlserver/schema_evidence.txt` |
| **T12** | Database Persistence | Dữ liệu được ghi vào SQL Server | Tạo record, dừng/khởi động lại app, query lại | Dữ liệu vẫn tồn tại bền vững trong SQL Server | Dữ liệu được lưu trong table `orchids` trên SQL Server | **PASS** | `evidence/console/T12.json` |

---

## 2. Break-It Lab Diagnosis & Analysis

| Mã lỗi | Thay đổi có chủ đích | Triệu chứng quan sát | Nguyên nhân gốc rễ (Root Cause) | Layer | Giải pháp khắc phục (Fix) & Retest |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **B1** | Sai cấu hình port hoặc `databaseName` trong `application.properties` | `CannotCreateTransactionException`, `Login failed` hoặc `Connection refused` | Driver JDBC không thể thiết lập socket connection hoặc xác thực thất bại với SQL Server | Configuration / JDBC | Kiểm tra lại TCP/IP port 1433, tên database `OrchidDB`, username `sa`, password; chạy lại app -> Khởi động thành công |
| **B2** | Bỏ annotation `@Id` khỏi class `Orchid` | Spring Boot không start được: `IllegalArgumentException: This class [com.example.orchid.pojos.Orchid] does not define an Id` | JPA specification bắt buộc mọi `@Entity` phải có ít nhất một trường `@Id` để quản lý Identity trong Persistence Context | JPA Mapping / Metadata | Thêm lại `@Id` và `@GeneratedValue(strategy = GenerationType.IDENTITY)` trên `orchidID` -> App start thành công |
| **B3** | Đổi `mappedBy = "category_id"` ở `OrchidCategory.orchids` | Hibernate báo lỗi: `AnnotationException: Unknown mappedBy target property: com.example.orchid.pojos.Orchid.category_id` | `mappedBy` phải trỏ tới **tên thuộc tính Java** ở entity phía Owning Side (`orchidCategory`), không phải tên cột DB (`category_id`) | Relationship Mapping | Đổi lại thành `mappedBy = "orchidCategory"` -> Hibernate scan và map thành công |
| **B4** | Đổi generic ID type của `IOrchidRepository` thành `String` (`JpaRepository<Orchid, String>`) | Compile error hoặc lỗi mismatch type khi gọi `findById(Long id)` | Khóa chính của `Orchid` là kiểu `Long`, JpaRepository phải khớp generic `<Orchid, Long>` | Repository Layer | Đảm bảo generic kiểu ID là `Long` tương ứng với kiểu trường `@Id private Long orchidID` |
| **B5** | Gửi request `POST /api/orchids` với `categoryId: 99999` (chưa tồn tại) | Request trả về status `400 Bad Request` kèm thông báo: `Category not found: 99999` | Service `resolveCategory()` tìm kiếm category trong DB trước khi gán. Do không tìm thấy nên ném `IllegalArgumentException`, Controller bắt lại và trả về HTTP `400` | Service / Business Logic | Seed category trước hoặc chỉ định category ID hợp lệ (ví dụ: `1` hoặc `2`) |
| **B6** | Gửi request `GET /api/orchids/999999` | Trả về status `404 Not Found` | `orchidRepository.findById(id)` trả về `Optional.empty()`. Controller dùng `.orElseGet(() -> ResponseEntity.notFound().build())` | Controller / REST API | ID hợp lệ sẽ trả về `200 OK`; ID không tồn tại được phân định rõ ràng bằng `404` |
| **B7** | Gửi request POST không có header `Content-Type: application/json` hoặc JSON bị lỗi cú pháp | Server trả về `415 Unsupported Media Type` hoặc `400 Bad Request` | Jackson HttpMessageConverter không thể parse body thành entity Object khi sai Media Type hoặc sai format JSON | HTTP / Jackson Serialization | Thiết lập đúng header `Content-Type: application/json` và validate JSON syntax trước khi gửi |
| **B8** | Đổi path `@RequestMapping("/orchids")` thay vì `/api/orchids` | Client gọi `/api/orchids` nhận `404 Not Found` | Spring Web MVC DispatcherServlet không khớp bất kỳ handler method nào với URL requested | Controller Routing | Đảm bảo đường dẫn Controller khớp với API Contract: `@RequestMapping("/api/orchids")` |
