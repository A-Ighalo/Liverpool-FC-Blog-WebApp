package com.liverpoolfc.blogwebapp.controller;

import com.liverpoolfc.blogwebapp.entity.BlogPost;
import com.liverpoolfc.blogwebapp.entity.User;
import com.liverpoolfc.blogwebapp.repository.BlogPostRepository;
import com.liverpoolfc.blogwebapp.repository.UserRepository;
import com.liverpoolfc.blogwebapp.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/blog")
public class BlogController {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    // Public endpoints
    @GetMapping("/public/posts")
    public ResponseEntity<Page<BlogPost>> getPublishedPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> posts = blogPostRepository.findByIsPublishedTrueOrderByPublishedAtDesc(pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/public/posts/{id}")
    public ResponseEntity<BlogPost> getPublishedPost(@PathVariable Long id) {
        Optional<BlogPost> post = blogPostRepository.findById(id);
        if (post.isPresent() && post.get().getIsPublished()) {
            return ResponseEntity.ok(post.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/public/posts/search")
    public ResponseEntity<Page<BlogPost>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BlogPost> posts = blogPostRepository.findPublishedByKeyword(keyword, pageable);
        return ResponseEntity.ok(posts);
    }

    // Authenticated endpoints
    @GetMapping("/posts")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<Page<BlogPost>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Pageable pageable = PageRequest.of(page, size);
        
        // Admin can see all posts, users can see only their own
        if (userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.ok(blogPostRepository.findAll(pageable));
        } else {
            Page<BlogPost> posts = blogPostRepository.findByAuthorIdOrderByCreatedAtDesc(
                    userPrincipal.getId(), pageable);
            return ResponseEntity.ok(posts);
        }
    }

    @PostMapping("/posts")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BlogPost> createPost(@Valid @RequestBody BlogPost blogPost,
                                              Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User author = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        blogPost.setAuthor(author);
        BlogPost savedPost = blogPostRepository.save(blogPost);
        return ResponseEntity.ok(savedPost);
    }

    @PutMapping("/posts/{id}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<BlogPost> updatePost(@PathVariable Long id,
                                              @Valid @RequestBody BlogPost blogPost,
                                              Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        
        Optional<BlogPost> existingPost = blogPostRepository.findById(id);
        if (existingPost.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        BlogPost post = existingPost.get();
        
        // Users can only edit their own posts, admins can edit any post
        boolean isAdmin = userPrincipal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
        boolean isAuthor = post.getAuthor().getId().equals(userPrincipal.getId());
        
        if (!isAdmin && !isAuthor) {
            return ResponseEntity.status(403).build();
        }

        post.setTitle(blogPost.getTitle());
        post.setSummary(blogPost.getSummary());
        post.setContent(blogPost.getContent());
        post.setImageUrl(blogPost.getImageUrl());
        post.setIsPublished(blogPost.getIsPublished());

        BlogPost updatedPost = blogPostRepository.save(post);
        return ResponseEntity.ok(updatedPost);
    }

    @DeleteMapping("/posts/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        if (blogPostRepository.existsById(id)) {
            blogPostRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}