package com.liverpoolfc.blogwebapp.controller;

import com.liverpoolfc.blogwebapp.entity.Fixture;
import com.liverpoolfc.blogwebapp.repository.FixtureRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/fixtures")
public class FixtureController {

    @Autowired
    private FixtureRepository fixtureRepository;

    // Public endpoints
    @GetMapping("/public/all")
    public ResponseEntity<Page<Fixture>> getAllFixtures(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Fixture> fixtures = fixtureRepository.findByOrderByMatchDateDesc(pageable);
        return ResponseEntity.ok(fixtures);
    }

    @GetMapping("/public/upcoming")
    public ResponseEntity<List<Fixture>> getUpcomingFixtures() {
        List<Fixture> fixtures = fixtureRepository.findByMatchDateAfterOrderByMatchDate(LocalDateTime.now());
        return ResponseEntity.ok(fixtures);
    }

    @GetMapping("/public/recent")
    public ResponseEntity<List<Fixture>> getRecentFixtures() {
        List<Fixture> fixtures = fixtureRepository.findByMatchDateBeforeOrderByMatchDateDesc(LocalDateTime.now());
        return ResponseEntity.ok(fixtures.stream().limit(10).toList());
    }

    @GetMapping("/public/liverpool")
    public ResponseEntity<Page<Fixture>> getLiverpoolFixtures(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Fixture> fixtures = fixtureRepository.findLiverpoolFixtures(pageable);
        return ResponseEntity.ok(fixtures);
    }

    @GetMapping("/public/competition/{competition}")
    public ResponseEntity<List<Fixture>> getFixturesByCompetition(@PathVariable Fixture.Competition competition) {
        List<Fixture> fixtures = fixtureRepository.findByCompetitionOrderByMatchDate(competition);
        return ResponseEntity.ok(fixtures);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Fixture> getFixture(@PathVariable Long id) {
        Optional<Fixture> fixture = fixtureRepository.findById(id);
        return fixture.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // Admin endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Fixture> createFixture(@Valid @RequestBody Fixture fixture) {
        Fixture savedFixture = fixtureRepository.save(fixture);
        return ResponseEntity.ok(savedFixture);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Fixture> updateFixture(@PathVariable Long id, @Valid @RequestBody Fixture fixture) {
        Optional<Fixture> existingFixture = fixtureRepository.findById(id);
        if (existingFixture.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Fixture fixtureToUpdate = existingFixture.get();
        fixtureToUpdate.setHomeTeam(fixture.getHomeTeam());
        fixtureToUpdate.setAwayTeam(fixture.getAwayTeam());
        fixtureToUpdate.setHomeScore(fixture.getHomeScore());
        fixtureToUpdate.setAwayScore(fixture.getAwayScore());
        fixtureToUpdate.setMatchDate(fixture.getMatchDate());
        fixtureToUpdate.setVenue(fixture.getVenue());
        fixtureToUpdate.setCompetition(fixture.getCompetition());
        fixtureToUpdate.setStatus(fixture.getStatus());

        Fixture updatedFixture = fixtureRepository.save(fixtureToUpdate);
        return ResponseEntity.ok(updatedFixture);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFixture(@PathVariable Long id) {
        if (fixtureRepository.existsById(id)) {
            fixtureRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}