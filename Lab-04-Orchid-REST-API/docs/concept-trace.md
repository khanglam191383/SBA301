# Concept Trace — Request-to-Database Architecture Trace

## 1. Trace Chi Tiết: `POST /api/orchids` (End-to-End)

```
HTTP Client (Postman)
       │
       ▼ [1. HTTP Request: POST /api/orchids, Header: Content-Type: application/json, Body: Orchid JSON]
Spring Web DispatcherServlet
       │
       ▼ [2. Controller Layer: OrchidController.create(@RequestBody Orchid orchid)]
       │     - Deserialize JSON payload thành Orchid Java object bằng Jackson.
       │     - Gọi orchidService.create(orchid).
       │
       ▼ [3. Service Layer: OrchidService.create(Orchid orchid)]
       │     - Transaction boundary bắt đầu (@Transactional).
       │     - Bắt buộc kiểm tra categoryId: resolveCategory(orchid).
       │     - Gọi categoryRepository.findById(categoryId).
       │     - Gán Managed Entity OrchidCategory vào Orchid (hoặc ném IllegalArgumentException nếu không tồn tại -> Controller trả 400).
       │     - Set orchidID = null (để SQL Server IDENTITY tự sinh).
       │     - Gọi orchidRepository.save(orchid).
       │
       ▼ [4. Repository Layer: IOrchidRepository extends JpaRepository<Orchid, Long>]
       │     - Spring Data JPA chuyển giao thao tác cho Hibernate EntityManager.
       │
       ▼ [5. Hibernate / JPA Persistence Context]
       │     - Chuyển entity Orchid sang trạng thái MANAGED.
       │     - Nhận diện category_id FK liên kết tới bảng orchid_categories.
       │     - Sinh mã SQL INSERT có tham số bind.
       │
       ▼ [6. Database Driver & SQL Server Engine]
       │     - JDBC Driver thực thi:
       │       INSERT INTO orchids (category_id, is_attractive, is_natural, orchid_description, orchid_name, orchidurl)
       │       VALUES (?, ?, ?, ?, ?, ?);
       │     - SQL Server kiểm tra Foreign Key Constraint FK_... trỏ tới orchid_categories(category_id).
       │     - SQL Server cấp phát giá trị IDENTITY mới cho cột orchidid.
       │     - Trả generated key về cho Hibernate.
       │
       ▼ [7. Service Transaction Commit]
       │     - Giao dịch commit thành công, gán generated orchidID vào Orchid object.
       │
       ▼ [8. Controller Response]
             - Trả về ResponseEntity.status(HttpStatus.CREATED).body(createdOrchid)
             - Response HTTP Status: 201 Created kèm JSON Orchid (có orchidID và category đã map).
```

---

## 2. Trace Chi Tiết: `GET /api/orchids/{id}`

1. **HTTP Request:** Client gửi `GET /api/orchids/1`.
2. **Controller:** `OrchidController.getById(@PathVariable Long id)` nhận `id=1`.
3. **Service:** `OrchidService.getById(1L)` gọi `orchidRepository.findById(1L)`.
4. **Repository & Hibernate:** `JpaRepository.findById(1L)` kích hoạt `EntityManager.find(Orchid.class, 1L)`.
5. **SQL Server:** Hibernate sinh và thực thi câu lệnh SQL:
   ```sql
   SELECT o.orchidid, o.is_attractive, o.is_natural, o.orchid_description, 
          o.orchid_name, o.orchidurl, o.category_id,
          c.category_id AS cat_id, c.category_name
   FROM orchids o
   LEFT JOIN orchid_categories c ON o.category_id = c.category_id
   WHERE o.orchidid = 1;
   ```
6. **Object Graph:** Hibernate load dữ liệu từ JDBC ResultSet, khởi tạo instance `Orchid` và gán instance `OrchidCategory` tương ứng.
7. **HTTP Response:** Controller bọc trong `ResponseEntity.ok(orchid)` -> Status `200 OK` + JSON. Nếu không tìm thấy, trả về `404 Not Found`.

---

## 3. Bản Chất Của Quan Hệ Orchid (N-1) OrchidCategory & Owning Side

- **Owning Side:** Thuộc về `Orchid` vì bảng `orchids` là bảng trực tiếp lưu trữ cột Foreign Key `category_id`.
  - Khai báo tại `Orchid.java`:
    ```java
    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private OrchidCategory orchidCategory;
    ```
- **Inverse Side:** Thuộc về `OrchidCategory`. Không chứa foreign key trong DB.
  - Khai báo tại `OrchidCategory.java`:
    ```java
    @OneToMany(mappedBy = "orchidCategory")
    @JsonIgnore
    private List<Orchid> orchids = new ArrayList<>();
    ```
  - `mappedBy = "orchidCategory"`: Trỏ trực tiếp đến **tên thuộc tính Java** `orchidCategory` khai báo bên phía Owning Side (`Orchid.java`), **tuyệt đối không phải** tên cột database (`category_id`).
  - `@JsonIgnore`: Ngăn chặn lỗi vòng lặp tuần tự hóa vô hạn (**Infinite JSON Recursion**) khi Jackson serialize object graph hai chiều (`Orchid` -> `OrchidCategory` -> `orchids` -> `Orchid`...).

---

## 4. Trả Lời 20 Câu Hỏi "Human Verification Gate"

1. **JPA là specification hay implementation?**  
   JPA (Jakarta Persistence) là **Specification** (đặc tả API/chuẩn giao diện), không phải thư viện thực thi trực tiếp.
2. **Hibernate đóng vai trò gì trong project này?**  
   Hibernate là **JPA Provider / Implementation**, đóng vai trò thực thi ORM, quản lý Session, sinh câu lệnh SQL và giao tiếp với JDBC Driver.
3. **Spring Data JPA bổ sung abstraction gì?**  
   Cung cấp Repository Abstraction (`JpaRepository`), tự động sinh implementation cho các tác vụ CRUD, paging, sorting và derived query method mà không cần viết boilerplate code.
4. **OrchidCategory.orchids có `mappedBy="orchidCategory"` nghĩa là gì?**  
   Nghĩa là `OrchidCategory` là phía Inverse (bị quản lý), còn mối quan hệ và khóa ngoại được ánh xạ bởi field `orchidCategory` trên entity `Orchid`.
5. **Foreign key `category_id` nằm ở table nào và vì sao?**  
   Nằm ở table `orchids` vì theo mô hình quan hệ 1-N, phía nhiều (N) phải chứa foreign key tham chiếu đến khóa chính của phía một (1).
6. **Nếu đổi mappedBy thành `category_id`, lỗi conceptual là gì?**  
   `mappedBy` quy định tên Java property của owning entity; nếu để `category_id` (tên cột DB), Hibernate sẽ không tìm thấy thuộc tính Java tương ứng và văng lỗi `AnnotationException: Unknown mappedBy target property`.
7. **Tại sao repository generic ID phải là `Long`?**  
   Vì trường `@Id` của `Orchid` (`orchidID`) được khai báo kiểu Wrapper `Long`. Generic ID type phải đồng nhất với kiểu dữ liệu của trường `@Id`.
8. **Tại sao `create()` phải resolve category từ repository?**  
   Để đảm bảo toàn vẹn dữ liệu: kiểm tra xem category mà client gửi lên có thực sự tồn tại trong database hay không trước khi lưu, tránh tạo liên kết mồ côi hoặc lỗi vi phạm foreign key không mong muốn.
9. **Tại sao service không nên trả `ResponseEntity`?**  
   Vì `ResponseEntity` thuộc về Web/HTTP Layer. Service Layer phải độc lập với giao thức truyền tải (chỉ xử lý nghiệp vụ/domain model), cho phép tái sử dụng ở CLI, gRPC, Message Queue...
10. **Tại sao controller không nên chứa SQL/data access?**  
    Vi phạm nguyên tắc Separation of Concerns (SoC). Controller chỉ nên làm nhiệm vụ routing, deserialize request, gọi service và đóng gói HTTP response.
11. **`@RequestBody` dùng cho dữ liệu nào?**  
    Dùng để bind dữ liệu trong HTTP Request Body (chuỗi JSON/XML) thành Java Object thông qua `HttpMessageConverter`.
12. **`@PathVariable` khác `@RequestParam` thế nào trong chính API này?**  
    - `@PathVariable`: Lấy giá trị trực tiếp từ URI path (ví dụ: `/api/orchids/1` -> `id = 1`).
    - `@RequestParam`: Lấy giá trị từ query string sau dấu `?` (ví dụ: `/api/orchids?name=Queen` -> `name = "Queen"`).
13. **POST thành công nên trả status nào? Vì sao?**  
    Nên trả `201 Created` vì một tài nguyên (resource) mới đã được tạo thành công trên server theo đúng chuẩn HTTP RFC.
14. **DELETE thành công không có body nên dùng status nào?**  
    Nên trả `204 No Content` để biểu thị server đã thực hiện yêu cầu thành công và không cần trả về bất kỳ nội dung nào trong body.
15. **GET missing id khác database connection failure thế nào?**  
    - GET missing id: Database hoạt động bình thường, truy vấn thành công nhưng không có bản ghi phù hợp -> Trả về HTTP `404 Not Found`.
    - Database connection failure: Không thể kết nối tới cơ sở dữ liệu -> Server không thể xử lý request -> Trả về HTTP `500 Internal Server Error` (hoặc lỗi cấu hình).
16. **Khi nào transaction của `create()` bắt đầu/kết thúc về mặt khái niệm?**  
    Bắt đầu khi luồng thực thi đi vào method `create()` có annotation `@Transactional`, và kết thúc (commit/rollback) khi method hoàn tất trả về kết quả (hoặc gặp RuntimeException).
17. **Tại sao test POST phải GET lại?**  
    Để kiểm chứng hậu điều kiện (Postcondition): đảm bảo dữ liệu không chỉ được phản hồi từ RAM tạm thời mà đã thực sự được lưu trữ bền vững trong database.
18. **Tại sao còn cần SELECT DB nếu Postman đã trả JSON?**  
    Để xác minh mức độ toàn vẹn của dữ liệu ở tầng vật lý (Physical Schema), kiểm tra chính xác giá trị cột Foreign Key `category_id` và các ràng buộc toàn vẹn của SQL Server.
19. **Nêu một rủi ro của bidirectional relationship khi serialize JSON.**  
    Gây ra lỗi vòng lặp vô tận `StackOverflowError` (Infinite Recursion) do Jackson serialize từ Category sang Orchids, rồi từ mỗi Orchid lại serialize ngược lại Category liên tục.
20. **Nếu AI đề xuất annotation khác, bạn sẽ kiểm chứng bằng evidence nào?**  
    Kiểm tra bằng: (1) Hibernate SQL console log khi ứng dụng start; (2) Truy vấn schema thực tế trong SQL Server; (3) Chạy test suite tự động để xác nhận contract không bị phá vỡ.

---

## 5. Trả Lời 8 Câu Hỏi Kiểm Tra Miệng Sau Test (Section 9.3)

1. **Khi POST thành công, component nào thực sự gửi SQL INSERT xuống database?**  
   Lớp Hibernate/JPA thông qua JDBC Driver (`mssql-jdbc`) và kết nối JDBC DataSource thực hiện gửi câu lệnh `INSERT INTO orchids...`.
2. **Vì sao Controller không nên gọi JpaRepository trực tiếp trong bài này?**  
   Vì nghiệp vụ yêu cầu kiểm tra validation quan hệ category (`resolveCategory`) và quản lý Transaction boundary (`@Transactional`). Nếu Controller gọi Repository thì logic này bị phân tán hoặc vi phạm ranh giới kiến trúc.
3. **`mappedBy="orchidCategory"` trỏ đến cái gì? Tại sao không phải "category_id"?**  
   Trỏ đến tên biến Java `private OrchidCategory orchidCategory` trong class `Orchid`. Không phải `category_id` vì JPA mapping dựa trên mô hình đối tượng (Object Model), không dựa trên tên cột cơ sở dữ liệu (Relational Model).
4. **Nếu `categoryId` không tồn tại, nên phát hiện ở layer nào? Vì sao?**  
   Nên phát hiện ở **Service Layer** vì đây là business rule (quy tắc nghiệp vụ về tính toàn vẹn quan hệ trước khi lưu), không nên đẩy xuống database để nhận SQLException.
5. **Status `204` khác `200` như thế nào với DELETE?**  
   `204 No Content` khẳng định tác vụ xóa hoàn tất và response không có body; trong khi `200 OK` thường yêu cầu kèm theo một response body (ví dụ message hoặc entity cũ).
6. **Tại sao phải GET lại hoặc SELECT DB sau POST/PUT/DELETE?**  
   Để chứng minh tính bền vững (Persistence) và xác nhận hậu điều kiện trạng thái thực tế của tài nguyên trên server.
7. **Spring Data tạo implementation của IOrchidRepository khi nào?**  
   Tại thời điểm **Application Startup** (khi Spring context khởi tạo component scan), Spring Data tạo dynamic proxy implementation dựa trên bytecode generation.
8. **Nếu app restart mà dữ liệu còn, điều đó chứng minh điểm gì so với in-memory repository?**  
   Chứng minh dữ liệu đã được lưu bền vững vào Disk Storage của SQL Server thay vì lưu tạm trên bộ nhớ RAM (In-Memory Collection sẽ mất sạch dữ liệu khi tắt JVM).
