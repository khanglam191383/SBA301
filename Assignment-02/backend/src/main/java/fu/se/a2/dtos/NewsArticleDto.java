package fu.se.a2.dtos;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class NewsArticleDto {

    private Integer newsArticleID;
    private String newsTitle;
    private String headline;
    private LocalDateTime createdDate;
    private String newsContent;
    private String newsSource;
    private Integer categoryID;
    private String categoryName;
    private String newsStatus;
    private Integer createdByID;
    private String createdByName;
    private Integer updatedByID;
    private String updatedByName;
    private LocalDateTime modifiedDate;
    private List<TagDto> tags = new ArrayList<>();
    private String tagsString;

    public NewsArticleDto() {
    }

    public Integer getNewsArticleID() {
        return newsArticleID;
    }

    public void setNewsArticleID(Integer newsArticleID) {
        this.newsArticleID = newsArticleID;
    }

    // Aliases for Frontend Compatibility
    public Integer getId() {
        return newsArticleID;
    }

    public void setId(Integer id) {
        this.newsArticleID = id;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    public String getTitle() {
        return newsTitle;
    }

    public void setTitle(String title) {
        this.newsTitle = title;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getCreatedAt() {
        return createdDate != null ? createdDate.toLocalDate().toString() : "";
    }

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public String getContent() {
        return newsContent;
    }

    public void setContent(String content) {
        this.newsContent = content;
    }

    public String getNewsSource() {
        return newsSource;
    }

    public void setNewsSource(String newsSource) {
        this.newsSource = newsSource;
    }

    public Integer getCategoryID() {
        return categoryID;
    }

    public void setCategoryID(Integer categoryID) {
        this.categoryID = categoryID;
    }

    public Integer getCategoryId() {
        return categoryID;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryID = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(String newsStatus) {
        this.newsStatus = newsStatus;
    }

    public int getStatus() {
        if ("1".equals(newsStatus) || "Active".equalsIgnoreCase(newsStatus)) {
            return 1;
        }
        return 0;
    }

    public void setStatus(int status) {
        this.newsStatus = String.valueOf(status);
    }

    public Integer getCreatedByID() {
        return createdByID;
    }

    public void setCreatedByID(Integer createdByID) {
        this.createdByID = createdByID;
    }

    public String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(String createdByName) {
        this.createdByName = createdByName;
    }

    public String getCreatedBy() {
        return createdByName;
    }

    public void setCreatedBy(String createdBy) {
        this.createdByName = createdBy;
    }

    public Integer getUpdatedByID() {
        return updatedByID;
    }

    public void setUpdatedByID(Integer updatedByID) {
        this.updatedByID = updatedByID;
    }

    public String getUpdatedByName() {
        return updatedByName;
    }

    public void setUpdatedByName(String updatedByName) {
        this.updatedByName = updatedByName;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public List<TagDto> getTags() {
        return tags;
    }

    public void setTags(List<TagDto> tags) {
        this.tags = tags;
    }

    public String getTagsString() {
        if (tagsString != null) return tagsString;
        if (tags == null || tags.isEmpty()) return "";
        return String.join(", ", tags.stream().map(TagDto::getTagName).toList());
    }

    public void setTagsString(String tagsString) {
        this.tagsString = tagsString;
    }
}
