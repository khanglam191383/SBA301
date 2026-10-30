package fu.se.a2.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.ArrayList;
import java.util.List;

public class NewsArticleRequest {

    @NotBlank(message = "News title is required")
    @Size(max = 255, message = "News title cannot exceed 255 characters")
    private String newsTitle;

    @Size(max = 500, message = "Headline cannot exceed 500 characters")
    private String headline;

    @NotBlank(message = "News content is required")
    private String newsContent;

    @Size(max = 150, message = "News source cannot exceed 150 characters")
    private String newsSource;

    @NotNull(message = "Category ID is required")
    private Integer categoryID;

    private String newsStatus = "1"; // "1" for Active, "0" for Inactive

    private List<String> tagNames = new ArrayList<>();
    private List<Integer> tagIds = new ArrayList<>();

    public NewsArticleRequest() {
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
    }

    public void setTitle(String title) {
        if (this.newsTitle == null) this.newsTitle = title;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public void setContent(String content) {
        if (this.newsContent == null) this.newsContent = content;
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

    public void setCategoryId(Integer categoryId) {
        if (this.categoryID == null) this.categoryID = categoryId;
    }

    public String getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(String newsStatus) {
        this.newsStatus = newsStatus;
    }

    public void setStatus(Object status) {
        if (status != null) {
            this.newsStatus = String.valueOf(status);
        }
    }

    public List<String> getTagNames() {
        return tagNames;
    }

    public void setTagNames(List<String> tagNames) {
        this.tagNames = tagNames;
    }

    public void setTags(Object tags) {
        if (tags instanceof String str) {
            this.tagNames = new ArrayList<>();
            for (String t : str.split(",")) {
                String trimmed = t.trim();
                if (!trimmed.isEmpty()) {
                    this.tagNames.add(trimmed);
                }
            }
        } else if (tags instanceof List<?> list) {
            this.tagNames = new ArrayList<>();
            for (Object item : list) {
                if (item != null) {
                    this.tagNames.add(item.toString().trim());
                }
            }
        }
    }

    public List<Integer> getTagIds() {
        return tagIds;
    }

    public void setTagIds(List<Integer> tagIds) {
        this.tagIds = tagIds;
    }
}
