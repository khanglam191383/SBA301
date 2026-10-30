package fu.se.a2.controllers;

import fu.se.a2.dtos.NewsArticleDto;
import fu.se.a2.dtos.NewsArticleRequest;
import fu.se.a2.security.CustomUserDetails;
import fu.se.a2.services.NewsArticleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff/news")
public class StaffNewsController {

    private final NewsArticleService newsArticleService;

    public StaffNewsController(NewsArticleService newsArticleService) {
        this.newsArticleService = newsArticleService;
    }

    @GetMapping
    public ResponseEntity<List<NewsArticleDto>> getAllNews(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String status) {
        List<NewsArticleDto> newsList = newsArticleService.searchStaffNews(keyword, categoryId, status);
        return ResponseEntity.ok(newsList);
    }

    @GetMapping("/my-history")
    public ResponseEntity<List<NewsArticleDto>> getMyNewsHistory(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<NewsArticleDto> history = newsArticleService.getMyHistory(userDetails.getAccountID());
        return ResponseEntity.ok(history);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticleDto> getNewsById(@PathVariable Integer id) {
        NewsArticleDto news = newsArticleService.getNewsById(id);
        return ResponseEntity.ok(news);
    }

    @PostMapping
    public ResponseEntity<NewsArticleDto> createNews(
            @Valid @RequestBody NewsArticleRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        NewsArticleDto created = newsArticleService.createNews(req, userDetails.getAccountID());
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticleDto> updateNews(
            @PathVariable Integer id,
            @Valid @RequestBody NewsArticleRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        NewsArticleDto updated = newsArticleService.updateNews(id, req, userDetails.getAccountID());
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Integer id) {
        newsArticleService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}
