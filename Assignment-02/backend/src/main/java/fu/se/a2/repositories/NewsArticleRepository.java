package fu.se.a2.repositories;

import fu.se.a2.entities.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Integer> {

    boolean existsByCreatedBy_AccountID(Integer accountId);

    boolean existsByCategory_CategoryID(Integer categoryId);

    long countByCategory_CategoryID(Integer categoryId);

    List<NewsArticle> findByCreatedBy_AccountIDOrderByCreatedDateDesc(Integer accountId);

    @Query("SELECT DISTINCT n FROM NewsArticle n " +
           "LEFT JOIN n.tags t " +
           "WHERE (:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.tagName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:categoryId IS NULL OR n.category.categoryID = :categoryId) " +
           "AND (:status IS NULL OR :status = '' OR n.newsStatus = :status) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchStaffNews(@Param("keyword") String keyword,
                                      @Param("categoryId") Integer categoryId,
                                      @Param("status") String status);

    @Query("SELECT DISTINCT n FROM NewsArticle n " +
           "LEFT JOIN n.tags t " +
           "WHERE (n.newsStatus = '1' OR LOWER(n.newsStatus) = 'active') " +
           "AND (:keyword IS NULL OR :keyword = '' OR " +
           "LOWER(n.newsTitle) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.headline) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(n.newsContent) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(t.tagName) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:categoryId IS NULL OR n.category.categoryID = :categoryId) " +
           "ORDER BY n.createdDate DESC")
    List<NewsArticle> searchPublicNews(@Param("keyword") String keyword,
                                       @Param("categoryId") Integer categoryId);
}
