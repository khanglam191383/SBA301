# Implementation Plan: FUNewsManagementSystem (Assignment 02)

## 1. REST API Endpoints Specification

### Authentication & Profile (`/api/auth`, `/api/staff/profile`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/login` | Public | Authenticate with email & password, returns JWT token & user info |
| GET | `/api/staff/profile` | Staff/Admin | View authenticated user profile |
| PUT | `/api/staff/profile` | Staff/Admin | Update authenticated user profile (name, password) |

### Public News (`/api/public`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/public/news` | Public | List published/active news articles (optional search & category filter) |
| GET | `/api/public/news/{id}` | Public | View active news article detail by ID |
| GET | `/api/public/categories` | Public | List active categories for public filtering |

### Admin: Account Management (`/api/admin/accounts`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/admin/accounts` | Admin (Role 1) | List all accounts with optional search (name, email) and role filter |
| GET | `/api/admin/accounts/{id}` | Admin (Role 1) | Get account details by ID |
| POST | `/api/admin/accounts` | Admin (Role 1) | Create new account (validated: unique email, role 1 or 2, password) |
| PUT | `/api/admin/accounts/{id}` | Admin (Role 1) | Update account details (name, email, role, optional password) |
| DELETE | `/api/admin/accounts/{id}` | Admin (Role 1) | Delete account (fails with 409 if account has created any news) |

### Staff: Category Management (`/api/staff/categories`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/staff/categories` | Staff/Admin | List categories with optional search (name, desc) & status filter |
| GET | `/api/staff/categories/{id}` | Staff/Admin | Get category details by ID |
| POST | `/api/staff/categories` | Staff (Role 2) | Create category (name, description, parentCategoryID, isActive) |
| PUT | `/api/staff/categories/{id}` | Staff (Role 2) | Update category details |
| DELETE | `/api/staff/categories/{id}` | Staff (Role 2) | Delete category (fails with 409 if category has any news articles) |

### Staff: News Article Management (`/api/staff/news`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/staff/news` | Staff/Admin | List news articles with search (title, content, tags) & filters |
| GET | `/api/staff/news/{id}` | Staff/Admin | Get news article detail with tags |
| POST | `/api/staff/news` | Staff (Role 2) | Create news article (title, headline, content, categoryId, tags, status) |
| PUT | `/api/staff/news/{id}` | Staff (Role 2) | Update news article |
| DELETE | `/api/staff/news/{id}` | Staff (Role 2) | Delete news article |
| GET | `/api/staff/news/my-history` | Staff (Role 2) | List news articles created by the authenticated staff member |

### Tags (`/api/staff/tags`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/staff/tags` | Staff/Admin | List existing tags for article tag selector |

---

## 2. Step-by-Step Implementation Strategy

### Step 1: Backend Project Setup & Database Configuration
- Setup Spring Boot 3.4.x project in `backend/` with Maven (Java 21).
- Add dependencies: Web, Data JPA, MS SQL Driver, Validation, Security, JJWT, H2 (for test).
- Configure `application.properties` (SQL Server connection with env defaults) and `src/test/resources/application-test.properties` (H2).
- Verify build with `mvn clean compile`.
- **Commit**: `[KhangLH] Initialize Spring Boot 3 backend project structure`

### Step 2: Entities & Repositories Layer
- Implement ERD entities: `SystemAccount`, `Category`, `Tag`, `NewsArticle` (`NewsTag` join table).
- Implement Spring Data JPA repositories with custom query methods (search, findByEmail, existsByCreatedBy_AccountID, countByCategoryId).
- Write Repository Unit / DataJpa tests using H2.
- **Commit**: `[KhangLH] Implement JPA entities and repositories according to ERD`

### Step 3: DTOs, Bean Validation & Global Exception Handling
- Create request & response DTOs with full Bean Validation annotations (`@NotBlank`, `@Email`, `@NotNull`, `@Size`).
- Create `GlobalExceptionHandler` with `@RestControllerAdvice` returning structured `ErrorResponse`.
- Write tests for validation & exception responses.
- **Commit**: `[KhangLH] Add DTOs, Bean Validation and global exception handling`

### Step 4: Business Logic Service Layer
- Implement `AccountService`: CRUD + Search, business rule preventing deletion if created news exists.
- Implement `CategoryService`: CRUD + Search, business rule preventing deletion if news exists.
- Implement `NewsArticleService`: CRUD + Search, tags handling, staff my-history filter.
- Implement `TagService` and `ProfileService`.
- Write comprehensive unit tests for services verifying business rules.
- **Commit**: `[KhangLH] Implement business services with deletion constraint rules`

### Step 5: Security, JWT & Authentication
- Implement `JwtTokenProvider`, `JwtAuthenticationFilter`, `CustomUserDetailsService`.
- Configure `SecurityConfig` with BCrypt, stateless session, role hierarchy / authorization rules, and CORS.
- Implement `AuthController` (`/api/auth/login`).
- Write authentication integration tests.
- **Commit**: `[KhangLH] Implement stateless JWT security and authentication controller`

### Step 6: REST Controllers & Data Seeding
- Implement `AdminAccountController`, `StaffCategoryController`, `StaffNewsController`, `StaffProfileController`, `PublicNewsController`.
- Implement `DataInitializer` (`CommandLineRunner`) with seed data: Admin, Staff, categories, tags, news articles.
- Write controller MockMvc tests verifying RBAC (Admin, Staff, Public) and endpoint behaviors.
- Run `mvn test` to ensure 100% test pass.
- **Commit**: `[KhangLH] Implement REST controllers and seed initial data`

### Step 7: Frontend Axios API Client & Authentication Integration
- Install `axios` in `frontend/`.
- Create centralized Axios instance `src/services/api.js` (JWT interceptor, 401 redirect, base URL config).
- Create modular API services: `authService.js`, `accountService.js`, `categoryService.js`, `newsService.js`.
- Update `LoginPage.jsx` to support login with Email + Password via REST API.
- Test login flow, token persistence, and role-based redirect.
- Run `npm run lint` and `npm run build`.
- **Commit**: `[KhangLH] Setup Axios client and connect login authentication to API`

### Step 8: Frontend Role-Based Layout, Public News View & Profile
- Add Public News Portal view for unauthenticated visitors.
- Update `Sidebar.jsx` and `AdminLayout.jsx` to filter tabs by role (Admin vs Staff).
- Connect Profile & News History views for Staff.
- Test FE build.
- **Commit**: `[KhangLH] Add public news portal and role-based navigation`

### Step 9: Frontend CRUD Modules Integration
- Connect `UserManagement.jsx` (Admin) to Account REST API (CRUD + Search + Validation errors + Delete check).
- Connect `CategoryManagement.jsx` (Staff) to Category REST API (CRUD + Search + Validation errors + Delete check).
- Connect `NewsManagement.jsx` (Staff) to News REST API (CRUD + Search + Tags + Status).
- Connect `Dashboard.jsx` to live backend counts.
- Run FE lint and build.
- **Commit**: `[KhangLH] Connect category, news, and account management to REST API`

### Step 10: End-to-End Verification & Final Report
- Run all BE tests (`mvn test`).
- Run all FE checks (`npm run lint`, `npm run build`).
- Verify complete workflows (Public visitor $\to$ Admin CRUD accounts $\to$ Staff CRUD categories & news $\to$ Business constraints).
- Write final summary report.
