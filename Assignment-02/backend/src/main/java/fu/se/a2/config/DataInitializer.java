package fu.se.a2.config;

import fu.se.a2.entities.Category;
import fu.se.a2.entities.NewsArticle;
import fu.se.a2.entities.SystemAccount;
import fu.se.a2.entities.Tag;
import fu.se.a2.repositories.CategoryRepository;
import fu.se.a2.repositories.NewsArticleRepository;
import fu.se.a2.repositories.SystemAccountRepository;
import fu.se.a2.repositories.TagRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SystemAccountRepository accountRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final NewsArticleRepository newsArticleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(SystemAccountRepository accountRepository,
                           CategoryRepository categoryRepository,
                           TagRepository tagRepository,
                           NewsArticleRepository newsArticleRepository,
                           PasswordEncoder passwordEncoder) {
        this.accountRepository = accountRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.newsArticleRepository = newsArticleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Seed only if account table is empty
        if (accountRepository.count() > 0) {
            return;
        }

        // 1. Seed Accounts
        SystemAccount admin = new SystemAccount();
        admin.setAccountName("Administrator");
        admin.setAccountEmail("admin.funews@fpt.edu.vn");
        admin.setAccountRole(1); // Admin
        admin.setAccountPassword(passwordEncoder.encode("Admin"));
        admin = accountRepository.save(admin);

        SystemAccount staff = new SystemAccount();
        staff.setAccountName("Nguyen Van A (Staff)");
        staff.setAccountEmail("staff01@funews.edu.vn");
        staff.setAccountRole(2); // Staff
        staff.setAccountPassword(passwordEncoder.encode("Password123"));
        staff = accountRepository.save(staff);

        SystemAccount staff2 = new SystemAccount();
        staff2.setAccountName("Tran Thi B (Editor)");
        staff2.setAccountEmail("tranthib.editor@fpt.edu.vn");
        staff2.setAccountRole(2); // Staff
        staff2.setAccountPassword(passwordEncoder.encode("Password123"));
        accountRepository.save(staff2);

        // 2. Seed Categories
        Category cat1 = categoryRepository.save(new Category(null, "Campus Technology & AI", "Cutting-edge tech, artificial intelligence initiatives, and modern computing labs at FPT University.", null, true));
        Category cat2 = categoryRepository.save(new Category(null, "Academic Highlights", "Updates on curricula, degree accreditations, international exchange semesters, and scholarships.", null, true));
        Category cat3 = categoryRepository.save(new Category(null, "Student Life & Events", "Club activities, campus fests, cultural nights, and student community engagements.", null, true));
        Category cat4 = categoryRepository.save(new Category(null, "Sports & Esports", "Varsity tournament results, football cups, chess competitions, and gaming leagues.", null, true));
        Category cat5 = categoryRepository.save(new Category(null, "Career & Enterprise Partnerships", "On-the-job training (OJT) opportunities, enterprise day visits, and corporate hiring fairs.", null, false));

        // 3. Seed Tags
        Tag tagAi = tagRepository.save(new Tag(null, "AI", "Artificial Intelligence"));
        Tag tagHardware = tagRepository.save(new Tag(null, "Hardware", "Computer hardware and computing"));
        Tag tagAcademic = tagRepository.save(new Tag(null, "Academic", "Academic curricula and research"));
        Tag tagGlobal = tagRepository.save(new Tag(null, "Global", "International exchange programs"));
        Tag tagEvent = tagRepository.save(new Tag(null, "Event", "Campus gatherings and exhibitions"));
        Tag tagSports = tagRepository.save(new Tag(null, "Sports", "Athletics and sports championships"));

        // 4. Seed News Articles
        NewsArticle article1 = new NewsArticle();
        article1.setNewsTitle("FPT University Unveils New High-Performance AI Research Lab");
        article1.setHeadline("The cutting-edge lab offers students hands-on access to GPU clusters and deep learning frameworks.");
        article1.setNewsContent("The cutting-edge lab offers students hands-on access to GPU clusters and deep learning frameworks for building real-world computer vision and natural language processing solutions.");
        article1.setNewsSource("FPT University News Desk");
        article1.setCategory(cat1);
        article1.setNewsStatus("1"); // Active
        article1.setCreatedBy(admin);
        article1.setCreatedDate(LocalDateTime.now().minusDays(5));
        article1.setModifiedDate(LocalDateTime.now().minusDays(5));
        article1.setTags(Set.of(tagAi, tagHardware));
        newsArticleRepository.save(article1);

        NewsArticle article2 = new NewsArticle();
        article2.setNewsTitle("Global Student Exchange Program Opens Applications for Spring Semester");
        article2.setHeadline("Undergraduate students can now apply for study-abroad terms with partner universities in Japan, Korea, and Germany.");
        article2.setNewsContent("Undergraduate students in Software Engineering and Business Administration can now apply for study-abroad terms with partner universities in Japan, South Korea, and Germany.");
        article2.setNewsSource("Office of International Affairs");
        article2.setCategory(cat2);
        article2.setNewsStatus("1"); // Active
        article2.setCreatedBy(staff);
        article2.setCreatedDate(LocalDateTime.now().minusDays(3));
        article2.setModifiedDate(LocalDateTime.now().minusDays(3));
        article2.setTags(Set.of(tagAcademic, tagGlobal));
        newsArticleRepository.save(article2);

        NewsArticle article3 = new NewsArticle();
        article3.setNewsTitle("Annual Campus TechFest 2026 Draws Over 2,000 Student Innovators");
        article3.setHeadline("Hackathon showcased innovative student projects ranging from smart IoT campus assistants to automated green gadgets.");
        article3.setNewsContent("The three-day hackathon and exhibition showcased innovative student projects ranging from smart IoT campus assistants to automated green energy monitoring gadgets.");
        article3.setNewsSource("Student Affairs Office");
        article3.setCategory(cat3);
        article3.setNewsStatus("1"); // Active
        article3.setCreatedBy(staff);
        article3.setCreatedDate(LocalDateTime.now().minusDays(2));
        article3.setModifiedDate(LocalDateTime.now().minusDays(2));
        article3.setTags(Set.of(tagEvent, tagAi));
        newsArticleRepository.save(article3);

        NewsArticle article4 = new NewsArticle();
        article4.setNewsTitle("Draft: Future Curriculum Updates for Emerging Cloud Technologies");
        article4.setHeadline("Internal discussion draft for upcoming syllabus modifications.");
        article4.setNewsContent("Internal review on incorporating cloud architecture, container orchestration, and serverless computing into advanced software engineering courses.");
        article4.setNewsSource("Academic Board");
        article4.setCategory(cat1);
        article4.setNewsStatus("0"); // Inactive / Draft
        article4.setCreatedBy(staff);
        article4.setCreatedDate(LocalDateTime.now().minusDays(1));
        article4.setModifiedDate(LocalDateTime.now().minusDays(1));
        article4.setTags(Set.of(tagAcademic));
        newsArticleRepository.save(article4);
    }
}
