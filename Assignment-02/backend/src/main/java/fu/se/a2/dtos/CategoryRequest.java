package fu.se.a2.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryRequest {

    @NotBlank(message = "Category name is required")
    @Size(max = 150, message = "Category name cannot exceed 150 characters")
    private String categoryName;

    @Size(max = 500, message = "Category description cannot exceed 500 characters")
    private String categoryDescription;

    private Integer parentCategoryID;

    private Boolean isActive = true;

    public CategoryRequest() {
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public void setName(String name) {
        if (this.categoryName == null) this.categoryName = name;
    }

    public String getCategoryDescription() {
        return categoryDescription;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    public void setDescription(String description) {
        if (this.categoryDescription == null) this.categoryDescription = description;
    }

    public Integer getParentCategoryID() {
        return parentCategoryID;
    }

    public void setParentCategoryID(Integer parentCategoryID) {
        this.parentCategoryID = parentCategoryID;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public void setStatus(Integer status) {
        if (status != null) {
            this.isActive = (status == 1);
        }
    }
}
