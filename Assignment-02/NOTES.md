# Design Decisions & Specification Notes

## 1. Project Naming & Identifiers
- **Student / Class Identifiers**:
  - Git Author: `KhangLH` (`khanglh.ce191383@gmail.com`)
  - Class Code: `SE1910`
  - Spring Boot Project Artifact: `A2KhangLH_SE1910` (package `fu.se.a2`)
  - Database Name: `A2KhangLH_SE1910` (configurable via `DB_URL` / `DB_NAME` env)
  - React Project: `A2KhangLH_SE1910` (`lamhoangkhang-se1910` / `a2khanglh-se1910`)

## 2. ERD Clarifications & Resolutions
- **Relationship between NewsArticle and Tag**:
  - Spec text says: *"a news article will have many tags and one tag will belong to zero or one news article"*.
  - ERD diagram defines `NewsTag` join table with composite PK (`NewsArticleID`, `TagID`) representing a Many-to-Many relationship (`NewsArticle` $\leftrightarrow$ `Tag`).
  - **Resolution**: Adhere strictly to the ERD diagram by implementing `@ManyToMany` through `NewsTag` join table.
- **Category Status / IsActive**:
  - ERD specifies `boolean IsActive`, while notes specify `active(1)/inactive(0)`.
  - **Resolution**: Backend stores `isActive` boolean (1/true = Active, 0/false = Inactive) and DTO maps both `isActive` and `status` (1/0) for full compatibility with React frontend.
- **News Status**:
  - ERD specifies `string NewsStatus`, while notes mention `active(1)/inactive(0)`.
  - **Resolution**: Backend stores `newsStatus` as String ("1" / "0" / "Active" / "Inactive") and accepts either format, serializing status cleanly for the frontend.
- **Category Description Field Name**:
  - ERD defines column `CategoryDesciption` (with typo in ERD).
  - **Resolution**: Entity property is `categoryDescription` with `@Column(name = "CategoryDesciption")` to honor exact ERD column schema while maintaining clean Java conventions.
- **Parent Category Self-Reference**:
  - ERD defines `ParentCategoryID FK` referencing `Category`.
  - **Resolution**: `@ManyToOne` self-referential relation `parentCategory` in `Category` entity with join column `ParentCategoryID`.
- **Delete Business Rules**:
  - Admin cannot delete `SystemAccount` if that account has created any `NewsArticle` (`CreatedByID`). Returns `409 Conflict` (or `400 Bad Request`) with message: `"Cannot delete account because it has created news articles."`
  - Staff cannot delete `Category` if that category has any associated `NewsArticle`. Returns `409 Conflict` (or `400 Bad Request`) with message: `"Cannot delete category because it contains news articles."`
