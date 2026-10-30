package fu.se.a2.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "Tag")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TagID")
    private Integer tagID;

    @Column(name = "TagName", length = 100, nullable = false, unique = true)
    private String tagName;

    @Column(name = "Note", length = 255)
    private String note;

    public Tag() {
    }

    public Tag(Integer tagID, String tagName, String note) {
        this.tagID = tagID;
        this.tagName = tagName;
        this.note = note;
    }

    public Integer getTagID() {
        return tagID;
    }

    public void setTagID(Integer tagID) {
        this.tagID = tagID;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
