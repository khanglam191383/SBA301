# FUNewsManagementSystem - ReactJS Administration Portal
**Assignment 01 • SBA301 – Integrate Single Page Application with Spring Boot**

* **Sinh viên thực hiện:** Lâm Hoàng Khang
* **Mã lớp:** SE1910
* **Project Directory:** `LamHoangKhang_SE1910`
* **Công nghệ:** ReactJS 19, Vite 8, Modern CSS (Design System Tokens, Responsive, Glassmorphism, Zero External Heavy UI Dependencies)

---

## 1. Giới thiệu tổng quan (Project Overview)
**FUNewsManagementSystem** là hệ thống quản trị tin tức trực tuyến cho trường đại học FPT (FPT University), được xây dựng dưới dạng ứng dụng đơn trang (**Single Page Application - SPA**) sử dụng thư viện **ReactJS** và công cụ đóng gói hiện đại **Vite**.

Hệ thống cung cấp giao diện quản trị trực quan, hiện đại, bảo mật và thân thiện với đầy đủ các nghiệp vụ quản lý:
1. **Mock Authentication & Session Guard:** Đăng nhập an toàn với tài khoản mặc định `Admin / Admin`, hỗ trợ kiểm tra thông tin đăng nhập, thông báo lỗi xác thực, lưu phiên làm việc qua `localStorage`.
2. **Master Admin Layout:** Gồm Header với logo hệ thống được thiết kế bằng AI, thanh điều hướng breadcrumb, thông tin người dùng đang đăng nhập, nút Reset Data và Logout. Sidebar bên trái hỗ trợ chuyển đổi linh hoạt 5 module chính mà không làm reload toàn bộ trang.
3. **Category Management:** Quản lý danh mục bài viết (Create, Read, Update, Delete, Realtime Search & Filter). Popup modal form cho Create/Update; Dialog cảnh báo và xác nhận khi Delete.
4. **News Article Management:** Quản lý bài viết tin tức với liên kết khóa ngoại `categoryId`, tags, tác giả, ngày tạo, trạng thái Active (Published) / Inactive (Draft). Hỗ trợ tìm kiếm đa trường và bộ lọc đa tiêu chí.
5. **User / Account Management:** Quản lý tài khoản quản trị viên (Admin - Role 1) và nhân viên biên tập (Staff - Role 2), kiểm tra username duy nhất, định dạng email và bảo vệ chống tự xóa tài khoản đang đăng nhập.
6. **Executive Dashboard:** Bảng điều khiển tổng quan với 4 thẻ chỉ số thống kê thời gian thực (KPI cards), danh sách bài viết gần đây, và biểu đồ tỷ lệ phân bố bài viết theo danh mục.
7. **System Settings & Data Diagnostics:** Trang cấu hình hồ sơ quản trị, xem thông số hệ thống, xuất bản sao lưu (Export JSON Backup) và phục hồi dữ liệu gốc (Factory Reset).

---

## 2. Hướng dẫn cài đặt và khởi chạy (Installation & Execution)

### 2.1 Yêu cầu môi trường
* **Node.js:** Phiên bản `>= 18.x` hoặc mới hơn.
* **npm:** Phiên bản `>= 9.x`.

### 2.2 Các bước thực hiện
1. **Mở terminal** tại thư mục gốc của project (`LamHoangKhang_SE1910`):
   ```bash
   cd LamHoangKhang_SE1910
   ```
2. **Cài đặt các gói phụ thuộc (Dependencies):**
   ```bash
   npm install
   ```
3. **Khởi chạy Development Server:**
   ```bash
   npm run dev
   ```
   Ứng dụng sẽ chạy tại địa chỉ: `http://localhost:5173/` (hoặc cổng hiển thị trên terminal).

4. **Kiểm tra tính toàn vẹn mã nguồn (Lint & Production Build):**
   ```bash
   npm run lint
   npm run build
   ```

---

## 3. Tài khoản kiểm thử (Evaluation Test Credentials)

| Vai trò (Role) | Username | Password | Quyền hạn (Permissions) |
|---|---|---|---|
| **Administrator (Role 1)** | `Admin` | `Admin` | Toàn quyền quản trị Dashboard, Category, News, Users, Settings |
| **Staff Member (Role 2)** | `staff01` | `Password123` | Tài khoản biên tập viên mẫu (Active) |
| **Staff Member (Role 2)** | `editor02` | `Password123` | Tài khoản phóng viên mẫu (Active) |
| **Inactive Staff Demo** | `intern_demo` | `Password123` | Tài khoản bị khóa (dùng để test case từ chối đăng nhập) |

---

## 4. Ma trận truy vết yêu cầu (Requirement Traceability Matrix - RTM)

| Mã ID | Yêu cầu nghiệp vụ | Bằng chứng mã nguồn / UI | Trạng thái |
|---|---|---|---|
| **R01** | Project ReactJS + Vite, đặt tên `LamHoangKhang_SE1910` | `package.json`, cấu trúc thư mục, lệnh `npm run dev` | **PASS (100%)** |
| **R02** | Login page có form controlled input, validate | `src/components/auth/LoginPage.jsx` | **PASS (100%)** |
| **R03** | Đăng nhập đúng `Admin/Admin` chuyển sang trang Admin | `App.jsx` (`currentUser` state & guard) | **PASS (100%)** |
| **R04** | Logo hệ thống tạo bằng công cụ AI | `public/fu_news_logo.jpg`, `src/assets/fu_news_logo.jpg` | **PASS (100%)** |
| **R05** | Header + Master Admin Layout dùng chung | `src/components/layout/AdminLayout.jsx`, `Header.jsx` | **PASS (100%)** |
| **R06** | Menu 5 khu vực: Dashboard, Category, News, Users, Settings | `src/components/layout/Sidebar.jsx` (active pill highlight) | **PASS (100%)** |
| **R07** | Category CRUD + Search (popup Create/Update, confirm Delete) | `src/components/categories/CategoryManagement.jsx` | **PASS (100%)** |
| **R08** | News CRUD + Search (liên kết CategoryId, popup, confirm) | `src/components/news/NewsManagement.jsx` | **PASS (100%)** |
| **R09** | User/Account CRUD + Search (Role 1 Admin, Role 2 Staff) | `src/components/users/UserManagement.jsx` | **PASS (100%)** |
| **R10** | Create/Update dùng popup dialog (Modal component) | `src/components/common/Modal.jsx` | **PASS (100%)** |
| **R11** | Delete yêu cầu xác nhận qua Confirmation Dialog | `src/components/common/ConfirmDialog.jsx` | **PASS (100%)** |
| **R12** | Mô hình dữ liệu chuẩn hóa, lưu trữ bền vững | `src/services/storageService.js`, `mockData.js` | **PASS (100%)** |

---

## 5. Cấu trúc mã nguồn (Project Architecture)

```text
LamHoangKhang_SE1910/
├── public/
│   ├── favicon.svg
│   └── fu_news_logo.jpg          # Logo FU News tạo bằng AI
├── src/
│   ├── assets/
│   │   └── fu_news_logo.jpg
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx     # Form đăng nhập với validation & credential test
│   │   ├── categories/
│   │   │   └── CategoryManagement.jsx # CRUD & Realtime Search danh mục
│   │   ├── common/
│   │   │   ├── ConfirmDialog.jsx # Hộp thoại xác nhận thao tác nguy hiểm (Delete)
│   │   │   ├── Icons.jsx         # Bộ biểu tượng SVG tối ưu hiệu năng
│   │   │   ├── Modal.jsx         # Popup Dialog tái sử dụng cho Create & Update
│   │   │   └── Toast.jsx         # Hệ thống thông báo kết quả (Toast messages)
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx     # Bảng chỉ số thống kê & phân bố danh mục
│   │   ├── layout/
│   │   │   ├── AdminLayout.jsx   # Khung giao diện quản trị tổng thể
│   │   │   ├── Header.jsx        # Thanh tiêu đề, breadcrumbs, user chip, logout
│   │   │   └── Sidebar.jsx       # Thanh điều hướng menu SPA 5 khu vực
│   │   ├── news/
│   │   │   └── NewsManagement.jsx# CRUD & Tìm kiếm bài viết tin tức
│   │   ├── settings/
│   │   │   └── SettingsPage.jsx  # Hồ sơ admin, chuẩn đoán và xuất/khôi phục dữ liệu
│   │   └── users/
│   │       └── UserManagement.jsx# CRUD & Tìm kiếm tài khoản quản trị/nhân viên
│   ├── services/
│   │   ├── mockData.js           # Dữ liệu mẫu khởi tạo chuẩn quan hệ
│   │   └── storageService.js     # Tầng truy xuất & đồng bộ hóa localStorage
│   ├── App.jsx                   # Component gốc điều phối State & Auth guard
│   ├── index.css                 # Hệ thống CSS Design System chuyên nghiệp
│   └── main.jsx                  # Điểm nhập ứng dụng React DOM
├── index.html                    # HTML trang chủ tải Font Inter & Favicon
├── package.json                  # Cấu hình scripts & dependencies
└── README.md                     # Tài liệu hướng dẫn và hồ sơ bảo vệ rubric
```

---

## 6. Ma trận kiểm thử hoàn chỉnh (Full Test Matrix - 35 Test Cases)

| # | Phân nhóm | Tên Test Case | Thao tác thực hiện | Kết quả mong đợi | Kết quả thực tế | Trạng thái |
|---|---|---|---|---|---|---|
| 1 | Login | Empty inputs | Bấm Sign In khi để trống username hoặc password | Không submit; hiện thông báo lỗi validation đỏ tại input | Validation báo lỗi chính xác | **PASS** |
| 2 | Login | Wrong credential | Nhập username hoặc password không chính xác | Không vào admin; hiện thông báo "Invalid credentials" | Báo lỗi, giữ nguyên trang login | **PASS** |
| 3 | Login | Valid Admin | Nhập `Admin` / `Admin` rồi bấm Sign In | Đăng nhập thành công, chuyển sang Dashboard | Vào thẳng Dashboard, hiện Toast | **PASS** |
| 4 | Auth | Logout | Bấm nút Logout tại Header | Hủy session, quay lại Login page; không vào được Admin | Phiên làm việc kết thúc an toàn | **PASS** |
| 5 | Layout | Menu completeness | Quan sát Sidebar bên trái | Đầy đủ 5 mục: Dashboard, Categories, News, Users, Settings | Đầy đủ 5 mục kèm icon & số lượng | **PASS** |
| 6 | Navigation | All menus click | Bấm lần lượt từng mục trên Sidebar | Chuyển đúng nội dung view, không reload trình duyệt | Chuyển mượt mà, highlight active | **PASS** |
| 7 | Category | Read list | Bấm vào menu Categories | Hiển thị bảng danh mục với đầy đủ cột ID, Name, Status | Bảng hiển thị đầy đủ 5 danh mục mẫu | **PASS** |
| 8 | Category | Create valid | Bấm "Add New Category", nhập tên hợp lệ rồi submit | Thêm record mới vào danh sách, modal đóng, hiện Toast | Record xuất hiện trên đầu bảng | **PASS** |
| 9 | Category | Create invalid | Mở dialog tạo mới, để trống tên danh mục rồi submit | Không thêm record; hiện lỗi "Category name is required" | Form chặn submit và báo lỗi | **PASS** |
| 10 | Category | Update | Bấm icon Edit tại 1 dòng, sửa thông tin rồi Save | Record được cập nhật đúng ID; modal đóng; Toast báo thành công | Record đổi tên chuẩn xác | **PASS** |
| 11 | Category | Delete cancel | Bấm icon Delete tại 1 dòng, sau đó chọn Cancel | Modal xác nhận đóng lại; record vẫn còn nguyên | Không có thay đổi nào xảy ra | **PASS** |
| 12 | Category | Delete confirm | Bấm icon Delete, kiểm tra cảnh báo rồi bấm Delete Permanently | Record bị xóa khỏi bảng; Toast đỏ thông báo thành công | Record biến mất khỏi bảng | **PASS** |
| 13 | Category | Search hit | Gõ từ khóa có trong tên danh mục (ví dụ "AI") | Bảng lọc còn các danh mục chứa từ khóa | Bảng lọc đúng kết quả | **PASS** |
| 14 | Category | Search miss | Gõ từ khóa không tồn tại (ví dụ "xyz999") | Hiển thị giao diện Empty State "No matching categories" | Hiện empty state + nút Clear Filter | **PASS** |
| 15 | News | Read list | Bấm vào menu News Articles | Hiển thị danh sách bài viết, tên category, tác giả, trạng thái | Hiển thị đầy đủ bài viết mẫu | **PASS** |
| 16 | News | Create valid | Bấm "Publish New Article", điền tiêu đề, chọn category, nội dung | Bài viết mới xuất hiện trong bảng, Toast báo thành công | Bài mới hiển thị với category tương ứng | **PASS** |
| 17 | News | Create invalid | Để trống tiêu đề hoặc nội dung rồi bấm submit | Form chặn lại và hiển thị lỗi tương ứng | Báo lỗi validation đỏ rõ ràng | **PASS** |
| 18 | News | Update | Bấm Edit bài viết, thay đổi tiêu đề hoặc status rồi lưu | Bài viết cập nhật đúng trường; giao diện render lại | Cập nhật chính xác | **PASS** |
| 19 | News | Delete cancel | Bấm Delete bài viết, sau đó bấm Cancel trên popup | Bài viết được giữ nguyên | Không mất dữ liệu | **PASS** |
| 20 | News | Delete confirm | Bấm Delete bài viết, bấm xác nhận Delete Permanently | Bài viết bị xóa khỏi danh sách | Xóa thành công, Toast thông báo | **PASS** |
| 21 | News | Search hit | Gõ từ khóa tiêu đề hoặc nội dung (ví dụ "Hackathon") | Danh sách lọc chính xác bài viết liên quan | Tìm kiếm tức thì không lag | **PASS** |
| 22 | News | Search miss | Gõ chuỗi tìm kiếm ngẫu nhiên không có trong database | Hiển thị Empty State kèm nút xóa bộ lọc | Hiển thị Empty State chuẩn | **PASS** |
| 23 | Users | Read list | Bấm vào menu User Accounts | Hiển thị danh sách người dùng, username, họ tên, role | Hiển thị bảng tài khoản chi tiết | **PASS** |
| 24 | Users | Create valid | Bấm "Add New Account", nhập username, pass, họ tên, email | Tài khoản mới được thêm vào hệ thống | Tài khoản xuất hiện trong bảng | **PASS** |
| 25 | Users | Create invalid | Để trống username/password hoặc trùng username đã có | Chặn submit, báo lỗi trùng hoặc thiếu trường | Kiểm tra trùng username thành công | **PASS** |
| 26 | Users | Update | Bấm Edit tài khoản Staff, đổi họ tên và role rồi lưu | Thông tin tài khoản được cập nhật chính xác | Record cập nhật ngay lập tức | **PASS** |
| 27 | Users | Delete cancel | Bấm Delete tài khoản Staff rồi bấm Cancel | Tài khoản vẫn còn nguyên | Giữ nguyên tài khoản | **PASS** |
| 28 | Users | Delete confirm | Bấm Delete tài khoản Staff và xác nhận xóa | Tài khoản bị xóa khỏi danh sách | Xóa thành công | **PASS** |
| 29 | Users | Search hit | Gõ tên người dùng vào ô tìm kiếm (ví dụ "Nguyen") | Danh sách lọc ra tài khoản tương ứng | Lọc đúng kết quả | **PASS** |
| 30 | Users | Search miss | Gõ từ khóa không tồn tại vào ô tìm kiếm | Hiển thị thông báo không tìm thấy tài khoản | Hiện Empty State | **PASS** |
| 31 | News | Relation | Tạo hoặc sửa bài viết, chọn danh mục từ dropdown | `categoryId` liên kết chính xác với category đã chọn | Khóa ngoại hiển thị đúng tên danh mục | **PASS** |
| 32 | User | Role mapping | Quan sát hiển thị cột Role của bảng Users | Role 1 hiển thị badge xanh "Admin", Role 2 hiển thị tím "Staff" | Badge role phân biệt trực quan | **PASS** |
| 33 | Status | Display | Quan sát các cột trạng thái Status | 1 hiển thị badge "Active/Published", 0 hiển thị "Inactive/Draft" | Trực quan, có dot màu nhận diện | **PASS** |
| 34 | Data | Empty state | Sử dụng chức năng tìm kiếm không có kết quả | Giao diện không bị lỗi trắng màn hình; hiện hộp thoại hướng dẫn | UI ổn định 100%, không crash | **PASS** |
| 35 | Persistence | Reload page | Thêm/sửa dữ liệu rồi F5 refresh trình duyệt | Dữ liệu vừa chỉnh sửa và phiên đăng nhập vẫn được bảo lưu | Khôi phục từ localStorage hoàn hảo | **PASS** |

---

## 7. Nhật ký sửa lỗi thực tế (Debugging Log)

| # | Triệu chứng lỗi (Symptom) | Giả thuyết ban đầu | Vị trí kiểm tra | Nguyên nhân gốc (Root Cause) | Giải pháp khắc phục (Fix) | Kết quả kiểm thử lại |
|---|---|---|---|---|---|---|
| **1** | Lệnh `npm run build` gặp lỗi không chạy được qua PowerShell script | Script execution policy bị chặn trên máy trạm Windows | Terminal PowerShell | Windows 11 mặc định cấm chạy `npm.ps1` chưa ký điện tử | Gọi lệnh qua `cmd.exe /c npm run build` hoặc dùng `npm.cmd` | Build hoàn thành thành công trong 105ms |
| **2** | ESLint báo lỗi 16 lỗi `no-unused-vars` do import React | Thừa import `React` trong các component chỉ dùng JSX | Các file `.jsx` trong `src/` | React 19 sử dụng JSX Transform mới, không cần `import React from 'react'` khi chỉ dùng hooks | Dọn dẹp import thừa, chỉ giữ các hooks cụ thể (`useState`, `useEffect`, `useMemo`) | `npm run lint` đạt 0 error, 0 warning |
| **3** | Người dùng có thể xóa nhầm tài khoản đang đăng nhập | Chưa có cơ chế bảo vệ phiên đăng nhập hiện hành | `UserManagement.jsx` | Thao tác delete không đối chiếu ID người dùng hiện tại | Thêm kiểm tra `currentUser.id === userToDelete.id`, làm mờ nút xóa và chặn thao tác | Bảo vệ tài khoản Admin đang đăng nhập 100% |

---

## 8. Nhật ký sử dụng AI (AI Usage Log & Engineering Practice)

| # | Prompt đã dùng | Mục đích kỹ thuật | Đề xuất của AI | Cách sinh viên kiểm chứng | Phần đã điều chỉnh & làm chủ |
|---|---|---|---|---|---|
| **1** | *"Modern sleek vector logo icon for FU News Management System featuring a modern stylized letter F fused with digital news broadcast waves or paper sheets, vibrant tech blue and gradient cyan colors"* | Sinh logo nhận diện thương hiệu cho FUNews theo yêu cầu R04 | Tạo ảnh logo AI với chữ F cách điệu và sóng phát thanh tin tức | Tải ảnh vào `public/fu_news_logo.jpg` và `src/assets/`, đối chiếu độ sắc nét và tỷ lệ khung hình | Chuyển thành avatar tròn/bo góc đồng bộ trên Header, Login và Sidebar |
| **2** | *"Design comprehensive design system CSS with dark navy sidebar, card elevation, accessible modals, and status badges"* | Xây dựng giao diện hiện đại thay thế cho template cũ | Bộ CSS tokens với biến HSL, box-shadow và media queries | Kiểm tra giao diện trên màn hình desktop và mobile; kiểm tra độ tương phản màu chữ WCAG | Tùy biến bảng màu FPT, bổ sung hiệu ứng backdrop blur cho modal dialog |
| **3** | *"Outline potential edge cases for Category deletion when linked with News articles"* | Đảm bảo tính toàn vẹn quan hệ dữ liệu giữa Category và News | Cảnh báo ràng buộc khóa ngoại (Foreign Key constraint check) | Thử xóa một danh mục đang có 3 bài viết liên kết | Bổ sung dòng cảnh báo số lượng bài viết bị ảnh hưởng ngay trong hộp thoại `ConfirmDialog` |

---

## 9. Hướng dẫn phỏng vấn đánh giá (Oral Defense & Interview Guide)

### Card A – Luồng đăng nhập (Authentication Flow)
* **Vị trí code:** [`src/components/auth/LoginPage.jsx`](file:///d:/SBA301-LABS/LABS/LamHoangKhang_SE1910/src/components/auth/LoginPage.jsx) & [`src/App.jsx`](file:///d:/SBA301-LABS/LABS/LamHoangKhang_SE1910/src/App.jsx).
* **Cơ chế:** Form sử dụng controlled inputs với `useState` cho `username` và `password`. Khi submit, `handleSubmit` thực hiện `e.preventDefault()`, kiểm tra rỗng, đối chiếu với tài khoản `Admin / Admin` (hoặc mock users). Nếu đúng, hàm `onLogin(adminUser)` được kích hoạt, cập nhật state `currentUser` trong `App.jsx` và lưu vào `localStorage`, từ đó chuyển hướng giao diện từ `LoginPage` sang `AdminLayout`.

### Card B – Luồng Create & Update bằng Modal Dialog
* **Vị trí code:** [`src/components/common/Modal.jsx`](file:///d:/SBA301-LABS/LABS/LamHoangKhang_SE1910/src/components/common/Modal.jsx), [`src/components/categories/CategoryManagement.jsx`](file:///d:/SBA301-LABS/LABS/LamHoangKhang_SE1910/src/components/categories/CategoryManagement.jsx).
* **Cơ chế:** Quản lý bằng 2 state: `isModalOpen` (boolean) và `modalMode` (`create` hoặc `update`).
  * Khi bấm **Add New**: `modalMode = 'create'`, form reset về giá trị rỗng mặc định.
  * Khi bấm **Edit**: `modalMode = 'update'`, lấy dữ liệu dòng được chọn gán vào `formData` để hiển thị trên các input.
  * Khi bấm **Save/Submit**: Kiểm tra validation; nếu là create thì tạo id mới và thêm vào mảng bằng immutable update (`setCategories(prev => [newCat, ...prev])`); nếu là update thì thay thế bằng `prev.map(c => c.id === updatedCat.id ? updatedCat : c)`.

### Card C – Luồng Delete với Confirmation
* **Vị trí code:** [`src/components/common/ConfirmDialog.jsx`](file:///d:/SBA301-LABS/LABS/LamHoangKhang_SE1910/src/components/common/ConfirmDialog.jsx).
* **Cơ chế:** Khi nhấn nút thùng rác, lưu đối tượng cần xóa vào state `categoryToDelete` và bật `isConfirmOpen = true`. Nếu người dùng bấm Cancel, modal đóng và không thay đổi dữ liệu. Nếu bấm Confirm Delete, thực hiện immutable remove thông qua hàm `filter`: `prev.filter(item => item.id !== idToDelete)` rồi ghi xuống storage.

### Card D – Luồng Search và Filter không làm mất dữ liệu gốc
* **Vị trí code:** `useMemo` trong `CategoryManagement.jsx`, `NewsManagement.jsx`, `UserManagement.jsx`.
* **Cơ chế:** Danh sách gốc `categories` hoặc `news` luôn được giữ nguyên trong state. Giao diện bảng chỉ render danh sách phái sinh `filteredCategories` hoặc `filteredNews` được tính toán thông qua hook `useMemo` dựa trên `searchTerm` và `statusFilter`. Khi xóa từ khóa tìm kiếm, bảng lập tức trở về đầy đủ danh sách ban đầu.

---

## 10. Bản tự xác nhận của sinh viên (Student Declaration)
> *"Tôi xin cam đoan toàn bộ mã nguồn của đồ án này đã được tự kiểm tra, hoạt động ổn định và đáp ứng đầy đủ tất cả các yêu cầu của SBA301 Assignment 01. Tôi sẵn sàng giải thích cặn kẽ từng dòng lệnh, luồng dữ liệu, cũng như thực hiện các yêu cầu thay đổi (Transfer Task) trực tiếp trong buổi phỏng vấn bảo vệ."*
>
> **Sinh viên:** Lâm Hoàng Khang — Lớp: SE1910.
