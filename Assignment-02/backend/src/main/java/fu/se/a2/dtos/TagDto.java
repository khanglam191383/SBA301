package fu.se.a2.dtos;

public class TagDto {

    private Integer tagID;
    private String tagName;
    private String note;

    public TagDto() {
    }

    public TagDto(Integer tagID, String tagName, String note) {
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

    public Integer getId() {
        return tagID;
    }

    public void setId(Integer id) {
        this.tagID = id;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }

    public String getName() {
        return tagName;
    }

    public void setName(String name) {
        this.tagName = name;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }
}
