# API Contract — Orchid REST API & JPA Integration Kit

Base URL: `http://localhost:8080` (Configurable via `server.port`)

## Endpoints Summary

| HTTP Verb | Path | Request Body | Query Params / Path Params | Expected Status | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/orchids` | None | `name` (optional, string) | `200 OK` | Lấy danh sách toàn bộ hoa lan hoặc tìm kiếm theo tên nếu có param `name` |
| **GET** | `/api/orchids/{id}` | None | `id` (path, Long) | `200 OK` / `404 Not Found` | Lấy thông tin chi tiết của một hoa lan theo ID |
| **POST** | `/api/orchids` | JSON `Orchid` | None | `201 Created` / `400 Bad Request` | Tạo mới một hoa lan kèm liên kết categoryId tồn tại |
| **PUT** | `/api/orchids/{id}` | JSON `Orchid` | `id` (path, Long) | `200 OK` / `400 Bad Request` / `404 Not Found` | Cập nhật toàn bộ trạng thái của hoa lan theo ID |
| **DELETE** | `/api/orchids/{id}` | None | `id` (path, Long) | `204 No Content` / `404 Not Found` | Xóa hoa lan theo ID |

---

## Detailed Contract

### 1. GET `/api/orchids`
- **Method:** `GET`
- **Path:** `/api/orchids`
- **Query Parameters:**
  - `name` (optional): Chuỗi từ khóa tìm kiếm (so khớp chứa chuỗi không phân biệt hoa/thường: `ContainingIgnoreCase`).
- **Response Headers:** `Content-Type: application/json`
- **Response Status:** `200 OK`
- **Response Body Sample:**
```json
[
  {
    "orchidID": 1,
    "orchidName": "Cattleya Queen",
    "isNatural": true,
    "orchidDescription": "Demo orchid for Slot 18",
    "orchidCategory": {
      "categoryId": 1,
      "categoryName": "Cattleya"
    },
    "isAttractive": true,
    "orchidURL": "https://example.com/orchid.jpg"
  }
]
```

### 2. GET `/api/orchids/{id}`
- **Method:** `GET`
- **Path:** `/api/orchids/{id}`
- **Path Variable:** `id` (Long, ID của Orchid)
- **Response Status:**
  - `200 OK`: Khi tìm thấy record.
  - `404 Not Found`: Khi ID không tồn tại trong database.
- **Response Body Sample (200):**
```json
{
  "orchidID": 1,
  "orchidName": "Cattleya Queen",
  "isNatural": true,
  "orchidDescription": "Demo orchid for Slot 18",
  "orchidCategory": {
    "categoryId": 1,
    "categoryName": "Cattleya"
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/orchid.jpg"
}
```

### 3. POST `/api/orchids`
- **Method:** `POST`
- **Path:** `/api/orchids`
- **Request Headers:** `Content-Type: application/json`
- **Request Body Sample:**
```json
{
  "orchidName": "Cattleya Queen",
  "isNatural": true,
  "orchidDescription": "Demo orchid for Slot 18",
  "orchidCategory": {
    "categoryId": 1
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/orchid.jpg"
}
```
- **Response Status:**
  - `201 Created`: Tạo thành công (kèm payload vừa tạo có `orchidID` sinh tự động).
  - `400 Bad Request`: Thiếu `categoryId` hoặc `categoryId` không tồn tại trong database (`orchid_categories`).

### 4. PUT `/api/orchids/{id}`
- **Method:** `PUT`
- **Path:** `/api/orchids/{id}`
- **Path Variable:** `id` (Long)
- **Request Headers:** `Content-Type: application/json`
- **Request Body Sample:**
```json
{
  "orchidName": "Cattleya Queen Updated",
  "isNatural": false,
  "orchidDescription": "Updated by PUT",
  "orchidCategory": {
    "categoryId": 2
  },
  "isAttractive": true,
  "orchidURL": "https://example.com/orchid-updated.jpg"
}
```
- **Response Status:**
  - `200 OK`: Cập nhật thành công.
  - `400 Bad Request`: `categoryId` không hợp lệ/không tồn tại.
  - `404 Not Found`: Không tìm thấy `id` hoa lan để cập nhật.

### 5. DELETE `/api/orchids/{id}`
- **Method:** `DELETE`
- **Path:** `/api/orchids/{id}`
- **Path Variable:** `id` (Long)
- **Response Status:**
  - `204 No Content`: Xóa thành công (không có response body).
  - `404 Not Found`: ID không tồn tại.
