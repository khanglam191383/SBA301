package fu.se.a2.services;

import fu.se.a2.dtos.CategoryDto;
import fu.se.a2.dtos.CategoryRequest;
import fu.se.a2.entities.Category;
import fu.se.a2.exceptions.ConflictException;
import fu.se.a2.exceptions.ResourceNotFoundException;
import fu.se.a2.repositories.CategoryRepository;
import fu.se.a2.repositories.NewsArticleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public CategoryService(CategoryRepository categoryRepository, NewsArticleRepository newsArticleRepository) {
        this.categoryRepository = categoryRepository;
        this.newsArticleRepository = newsArticleRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories(String keyword, Boolean isActive) {
        List<Category> categories = categoryRepository.searchCategories(keyword, isActive);
        return categories.stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue().stream().map(this::mapToDto).toList();
    }

    @Transactional(readOnly = true)
    public CategoryDto getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));
        return mapToDto(category);
    }

    public CategoryDto createCategory(CategoryRequest req) {
        if (categoryRepository.existsByCategoryName(req.getCategoryName())) {
            throw new ConflictException("Category name '" + req.getCategoryName() + "' already exists.");
        }

        Category category = new Category();
        category.setCategoryName(req.getCategoryName());
        category.setCategoryDesciption(req.getCategoryDescription());
        category.setIsActive(req.getIsActive() != null ? req.getIsActive() : true);

        if (req.getParentCategoryID() != null) {
            Category parent = categoryRepository.findById(req.getParentCategoryID())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with ID: " + req.getParentCategoryID()));
            category.setParentCategory(parent);
        }

        Category saved = categoryRepository.save(category);
        return mapToDto(saved);
    }

    public CategoryDto updateCategory(Integer id, CategoryRequest req) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        if (categoryRepository.existsByCategoryNameAndCategoryIDNot(req.getCategoryName(), id)) {
            throw new ConflictException("Category name '" + req.getCategoryName() + "' is already in use.");
        }

        category.setCategoryName(req.getCategoryName());
        category.setCategoryDesciption(req.getCategoryDescription());
        if (req.getIsActive() != null) {
            category.setIsActive(req.getIsActive());
        }

        if (req.getParentCategoryID() != null) {
            if (req.getParentCategoryID().equals(id)) {
                throw new IllegalArgumentException("A category cannot be its own parent.");
            }
            Category parent = categoryRepository.findById(req.getParentCategoryID())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with ID: " + req.getParentCategoryID()));
            category.setParentCategory(parent);
        } else {
            category.setParentCategory(null);
        }

        Category updated = categoryRepository.save(category);
        return mapToDto(updated);
    }

    public void deleteCategory(Integer id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + id));

        // Business Rule: The delete action will delete an item in the case this item does NOT belong to any news articles.
        // If the item is already stored in a news article, cannot delete.
        if (newsArticleRepository.existsByCategory_CategoryID(id)) {
            throw new ConflictException("Cannot delete category because it contains news articles.");
        }

        categoryRepository.delete(category);
    }

    private CategoryDto mapToDto(Category cat) {
        CategoryDto dto = new CategoryDto(
                cat.getCategoryID(),
                cat.getCategoryName(),
                cat.getCategoryDesciption(),
                cat.getParentCategory() != null ? cat.getParentCategory().getCategoryID() : null,
                cat.getIsActive()
        );
        if (cat.getParentCategory() != null) {
            dto.setParentCategoryName(cat.getParentCategory().getCategoryName());
        }
        dto.setLinkedNewsCount(newsArticleRepository.countByCategory_CategoryID(cat.getCategoryID()));
        return dto;
    }
}
