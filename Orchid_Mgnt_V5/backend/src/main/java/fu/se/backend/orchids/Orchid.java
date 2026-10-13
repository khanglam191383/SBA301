package fu.se.backend.orchids;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Orchid")
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrchidID")
    private Integer orchidId;

    @NotBlank(message = "Orchid name cannot be blank")
    @Size(max = 150)
    @Column(name = "OrchidName", nullable = false, length = 150)
    private String orchidName;

    @Column(name = "IsNatural", nullable = false)
    @JsonProperty("natural")
    private boolean natural;

    @Size(max = 1000)
    @Column(name = "OrchidDescription", length = 1000)
    private String orchidDescription;

    @Size(max = 100)
    @Column(name = "OrchidCategory", length = 100)
    private String orchidCategory;

    @Column(name = "IsAttractive", nullable = false)
    @JsonProperty("attractive")
    private boolean attractive;

    @Size(max = 1000)
    @Column(name = "OrchidURL", length = 1000)
    private String orchidURL;

    public Orchid() {
    }

    public Orchid(Integer orchidId, String orchidName, boolean natural, String orchidDescription,
                  String orchidCategory, boolean attractive, String orchidURL) {
        this.orchidId = orchidId;
        this.orchidName = orchidName;
        this.natural = natural;
        this.orchidDescription = orchidDescription;
        this.orchidCategory = orchidCategory;
        this.attractive = attractive;
        this.orchidURL = orchidURL;
    }

    public Integer getOrchidId() {
        return orchidId;
    }

    public void setOrchidId(Integer orchidId) {
        this.orchidId = orchidId;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public boolean isNatural() {
        return natural;
    }

    public void setNatural(boolean natural) {
        this.natural = natural;
    }

    // Secondary aliases for maximum framework compatibility (ignored in JSON to avoid duplicates)
    @JsonIgnore
    public boolean getIsNatural() {
        return natural;
    }

    @JsonIgnore
    public void setIsNatural(boolean natural) {
        this.natural = natural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public String getOrchidCategory() {
        return orchidCategory;
    }

    public void setOrchidCategory(String orchidCategory) {
        this.orchidCategory = orchidCategory;
    }

    public boolean isAttractive() {
        return attractive;
    }

    public void setAttractive(boolean attractive) {
        this.attractive = attractive;
    }

    // Secondary aliases for maximum framework compatibility (ignored in JSON to avoid duplicates)
    @JsonIgnore
    public boolean getIsAttractive() {
        return attractive;
    }

    @JsonIgnore
    public void setIsAttractive(boolean attractive) {
        this.attractive = attractive;
    }

    public String getOrchidURL() {
        return orchidURL;
    }

    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }
}
