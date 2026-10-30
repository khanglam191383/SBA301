package fu.se.a2.controllers;

import fu.se.a2.dtos.CategoryDto;
import fu.se.a2.dtos.NewsArticleDto;
import fu.se.a2.services.CategoryService;
import fu.se.a2.services.NewsArticleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicNewsController {

    private final NewsArticleService newsArticleService;
    private final CategoryService categoryService;

    public PublicNewsController(NewsArticleService newsArticleService, CategoryService categoryService) {
        this.newsArticleService = newsArticleService;
        this.categoryService = categoryService;
    }

    @GetMapping("/news")
    public ResponseEntity<List<NewsArticleDto>> getPublicNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId) {
        List<NewsArticleDto> newsList = newsArticleService.searchPublicNews(keyword, categoryId);
        return ResponseEntity.ok(newsList);
    }

    @GetMapping("/news/{id}")
    public ResponseEntity<NewsArticleDto> getPublicNewsDetail(@PathVariable Integer id) {
        NewsArticleDto news = newsArticleService.getNewsById(id);
        // Only return if status is active
        if (news.getStatus() != 1) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(news);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getPublicCategories() {
        return ResponseEntity.ok(categoryService.getActiveCategories());
    }
}
