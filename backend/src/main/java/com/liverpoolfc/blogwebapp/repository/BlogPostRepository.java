package com.liverpoolfc.blogwebapp.repository;

import com.liverpoolfc.blogwebapp.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    Page<BlogPost> findByIsPublishedTrueOrderByPublishedAtDesc(Pageable pageable);
    
    @Query("SELECT bp FROM BlogPost bp WHERE bp.isPublished = true AND " +
           "(LOWER(bp.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(bp.summary) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<BlogPost> findPublishedByKeyword(String keyword, Pageable pageable);
    
    Page<BlogPost> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);
}