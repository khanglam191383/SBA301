package fu.se.a2.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Category")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Integer categoryID;

    @Column(name = "CategoryName", length = 150, nullable = false)
    private String categoryName;

    @Column(name = "CategoryDesciption", length = 500)
    private String categoryDesciption;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCategoryID")
    private Category parentCategory;

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive = true;

    public Category() {
    }

    public Category(Integer categoryID, String categoryName, String categoryDesciption, Category parentCategory, Boolean isActive) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.categoryDesciption = categoryDesciption;
        this.parentCategory = parentCategory;
        this.isActive = isActive;
    }

    public Integer getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Integer categoryID) {
        this.categoryID = categoryID;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryDesciption() {
        return categoryDesciption;
    }

    public void setCategoryDesciption(String categoryDesciption) {
        this.categoryDesciption = categoryDesciption;
    }

    public String getCategoryDescription() {
        return categoryDesciption;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDesciption = categoryDescription;
    }

    public Category getParentCategory() {
        return parentCategory;
    }

    public void setParentCategory(Category parentCategory) {
        this.parentCategory = parentCategory;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
