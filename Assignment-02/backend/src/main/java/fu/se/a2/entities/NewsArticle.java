package fu.se.a2.entities;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "NewsArticle")
public class NewsArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NewsArticleID")
    private Integer newsArticleID;

    @Column(name = "NewsTitle", length = 255, nullable = false)
    private String newsTitle;

    @Column(name = "Headline", length = 500)
    private String headline;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @Column(name = "NewsContent", columnDefinition = "TEXT")
    private String newsContent;

    @Column(name = "NewsSource", length = 150)
    private String newsSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID")
    private Category category;

    @Column(name = "NewsStatus", length = 50)
    private String newsStatus; // "1" / "Active" (published), "0" / "Inactive" (draft)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "UpdatedByID")
    private SystemAccount updatedBy;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "NewsTag",
        joinColumns = @JoinColumn(name = "NewsArticleID"),
        inverseJoinColumns = @JoinColumn(name = "TagID")
    )
    private Set<Tag> tags = new HashSet<>();

    public NewsArticle() {
    }

    public Integer getNewsArticleID() {
        return newsArticleID;
    }

    public void setNewsArticleID(Integer newsArticleID) {
        this.newsArticleID = newsArticleID;
    }

    public String getNewsTitle() {
        return newsTitle;
    }

    public void setNewsTitle(String newsTitle) {
        this.newsTitle = newsTitle;
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

    public String getNewsContent() {
        return newsContent;
    }

    public void setNewsContent(String newsContent) {
        this.newsContent = newsContent;
    }

    public String getNewsSource() {
        return newsSource;
    }

    public void setNewsSource(String newsSource) {
        this.newsSource = newsSource;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getNewsStatus() {
        return newsStatus;
    }

    public void setNewsStatus(String newsStatus) {
        this.newsStatus = newsStatus;
    }

    public SystemAccount getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(SystemAccount createdBy) {
        this.createdBy = createdBy;
    }

    public SystemAccount getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(SystemAccount updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getModifiedDate() {
        return modifiedDate;
    }

    public void setModifiedDate(LocalDateTime modifiedDate) {
        this.modifiedDate = modifiedDate;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }
}
