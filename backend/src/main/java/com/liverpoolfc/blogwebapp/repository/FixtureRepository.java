package com.liverpoolfc.blogwebapp.repository;

import com.liverpoolfc.blogwebapp.entity.Fixture;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FixtureRepository extends JpaRepository<Fixture, Long> {
    Page<Fixture> findByOrderByMatchDateDesc(Pageable pageable);
    
    List<Fixture> findByMatchDateAfterOrderByMatchDate(LocalDateTime date);
    
    List<Fixture> findByMatchDateBeforeOrderByMatchDateDesc(LocalDateTime date);
    
    @Query("SELECT f FROM Fixture f WHERE " +
           "(LOWER(f.homeTeam) = 'liverpool' OR LOWER(f.awayTeam) = 'liverpool') " +
           "ORDER BY f.matchDate DESC")
    Page<Fixture> findLiverpoolFixtures(Pageable pageable);
    
    List<Fixture> findByCompetitionOrderByMatchDate(Fixture.Competition competition);
}