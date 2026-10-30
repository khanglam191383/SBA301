package fu.se.a2.dtos;

public class CategoryDto {

    private Integer categoryID;
    private String categoryName;
    private String categoryDescription;
    private Integer parentCategoryID;
    private String parentCategoryName;
    private Boolean isActive;
    private long linkedNewsCount;

    public CategoryDto() {
    }

    public CategoryDto(Integer categoryID, String categoryName, String categoryDescription, Integer parentCategoryID, Boolean isActive) {
        this.categoryID = categoryID;
        this.categoryName = categoryName;
        this.categoryDescription = categoryDescription;
        this.parentCategoryID = parentCategoryID;
        this.isActive = isActive;
    }

    public Integer getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Integer categoryID) {
        this.categoryID = categoryID;
    }

    // Aliases for Frontend Compatibility
    public Integer getId() {
        return categoryID;
    }

    public void setId(Integer id) {
        this.categoryID = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getName() {
        return categoryName;
    }

    public void setName(String name) {
        this.categoryName = name;
    }

    public String getCategoryDescription() {
        return categoryDescription;
    }

    public void setCategoryDescription(String categoryDescription) {
        this.categoryDescription = categoryDescription;
    }

    public String getCategoryDesciption() {
        return categoryDescription;
    }

    public void setCategoryDesciption(String categoryDesciption) {
        this.categoryDescription = categoryDesciption;
    }

    public String getDescription() {
        return categoryDescription;
    }

    public void setDescription(String description) {
        this.categoryDescription = description;
    }

    public Integer getParentCategoryID() {
        return parentCategoryID;
    }

    public void setParentCategoryID(Integer parentCategoryID) {
        this.parentCategoryID = parentCategoryID;
    }

    public String getParentCategoryName() {
        return parentCategoryName;
    }

    public void setParentCategoryName(String parentCategoryName) {
        this.parentCategoryName = parentCategoryName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public int getStatus() {
        return Boolean.TRUE.equals(isActive) ? 1 : 0;
    }

    public void setStatus(int status) {
        this.isActive = (status == 1);
    }

    public long getLinkedNewsCount() {
        return linkedNewsCount;
    }

    public void setLinkedNewsCount(long linkedNewsCount) {
        this.linkedNewsCount = linkedNewsCount;
    }

    public boolean isHasNews() {
        return linkedNewsCount > 0;
    }
}
