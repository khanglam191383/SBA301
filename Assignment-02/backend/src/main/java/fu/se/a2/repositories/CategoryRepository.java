package fu.se.a2.repositories;

import fu.se.a2.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    List<Category> findByIsActiveTrue();

    boolean existsByCategoryName(String categoryName);

    boolean existsByCategoryNameAndCategoryIDNot(String categoryName, Integer categoryID);

    @Query("SELECT c FROM Category c WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(c.categoryName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.categoryDesciption) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:isActive IS NULL OR c.isActive = :isActive)")
    List<Category> searchCategories(@Param("keyword") String keyword, @Param("isActive") Boolean isActive);
}
