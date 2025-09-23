package com.liverpoolfc.blogwebapp.repository;

import com.liverpoolfc.blogwebapp.entity.PlayerStats;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerStatsRepository extends JpaRepository<PlayerStats, Long> {
    List<PlayerStats> findBySeasonOrderByGoalsDesc(String season);
    
    Page<PlayerStats> findBySeasonOrderByPlayerName(String season, Pageable pageable);
    
    Optional<PlayerStats> findByPlayerNameAndSeason(String playerName, String season);
    
    @Query("SELECT ps FROM PlayerStats ps WHERE ps.season = :season ORDER BY ps.goals DESC")
    List<PlayerStats> findTopScorersBySeason(String season);
    
    @Query("SELECT ps FROM PlayerStats ps WHERE ps.season = :season ORDER BY ps.assists DESC")
    List<PlayerStats> findTopAssistsBySeason(String season);
    
    @Query("SELECT DISTINCT ps.season FROM PlayerStats ps ORDER BY ps.season DESC")
    List<String> findDistinctSeasons();
}