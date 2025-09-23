package com.liverpoolfc.blogwebapp.controller;

import com.liverpoolfc.blogwebapp.entity.PlayerStats;
import com.liverpoolfc.blogwebapp.repository.PlayerStatsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/stats")
public class PlayerStatsController {

    @Autowired
    private PlayerStatsRepository playerStatsRepository;

    // Public endpoints
    @GetMapping("/public/all")
    public ResponseEntity<Page<PlayerStats>> getAllPlayerStats(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String season) {
        Pageable pageable = PageRequest.of(page, size);
        
        if (season != null && !season.isEmpty()) {
            Page<PlayerStats> stats = playerStatsRepository.findBySeasonOrderByPlayerName(season, pageable);
            return ResponseEntity.ok(stats);
        } else {
            return ResponseEntity.ok(playerStatsRepository.findAll(pageable));
        }
    }

    @GetMapping("/public/top-scorers")
    public ResponseEntity<List<PlayerStats>> getTopScorers(
            @RequestParam(defaultValue = "2023-24") String season) {
        List<PlayerStats> topScorers = playerStatsRepository.findTopScorersBySeason(season);
        return ResponseEntity.ok(topScorers.stream().limit(10).toList());
    }

    @GetMapping("/public/top-assists")
    public ResponseEntity<List<PlayerStats>> getTopAssists(
            @RequestParam(defaultValue = "2023-24") String season) {
        List<PlayerStats> topAssists = playerStatsRepository.findTopAssistsBySeason(season);
        return ResponseEntity.ok(topAssists.stream().limit(10).toList());
    }

    @GetMapping("/public/seasons")
    public ResponseEntity<List<String>> getAvailableSeasons() {
        List<String> seasons = playerStatsRepository.findDistinctSeasons();
        return ResponseEntity.ok(seasons);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<PlayerStats> getPlayerStats(@PathVariable Long id) {
        Optional<PlayerStats> stats = playerStatsRepository.findById(id);
        return stats.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/player/{playerName}")
    public ResponseEntity<PlayerStats> getPlayerStatsByName(
            @PathVariable String playerName,
            @RequestParam(defaultValue = "2023-24") String season) {
        Optional<PlayerStats> stats = playerStatsRepository.findByPlayerNameAndSeason(playerName, season);
        return stats.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlayerStats> createPlayerStats(@Valid @RequestBody PlayerStats playerStats) {
        PlayerStats savedStats = playerStatsRepository.save(playerStats);
        return ResponseEntity.ok(savedStats);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlayerStats> updatePlayerStats(@PathVariable Long id, 
                                                         @Valid @RequestBody PlayerStats playerStats) {
        Optional<PlayerStats> existingStats = playerStatsRepository.findById(id);
        if (existingStats.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PlayerStats statsToUpdate = existingStats.get();
        statsToUpdate.setPlayerName(playerStats.getPlayerName());
        statsToUpdate.setPosition(playerStats.getPosition());
        statsToUpdate.setJerseyNumber(playerStats.getJerseyNumber());
        statsToUpdate.setAppearances(playerStats.getAppearances());
        statsToUpdate.setGoals(playerStats.getGoals());
        statsToUpdate.setAssists(playerStats.getAssists());
        statsToUpdate.setYellowCards(playerStats.getYellowCards());
        statsToUpdate.setRedCards(playerStats.getRedCards());
        statsToUpdate.setMinutesPlayed(playerStats.getMinutesPlayed());
        statsToUpdate.setSeason(playerStats.getSeason());
        statsToUpdate.setPlayerImageUrl(playerStats.getPlayerImageUrl());

        PlayerStats updatedStats = playerStatsRepository.save(statsToUpdate);
        return ResponseEntity.ok(updatedStats);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlayerStats(@PathVariable Long id) {
        if (playerStatsRepository.existsById(id)) {
            playerStatsRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}