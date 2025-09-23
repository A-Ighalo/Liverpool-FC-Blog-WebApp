package com.liverpoolfc.blogwebapp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;

@Entity
@Table(name = "player_stats")
public class PlayerStats {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "player_name")
    private String playerName;

    @NotBlank
    private String position;

    @Column(name = "jersey_number")
    private Integer jerseyNumber;

    @PositiveOrZero
    private Integer appearances = 0;

    @PositiveOrZero
    private Integer goals = 0;

    @PositiveOrZero
    private Integer assists = 0;

    @PositiveOrZero
    @Column(name = "yellow_cards")
    private Integer yellowCards = 0;

    @PositiveOrZero
    @Column(name = "red_cards")
    private Integer redCards = 0;

    @PositiveOrZero
    @Column(name = "minutes_played")
    private Integer minutesPlayed = 0;

    @Column(name = "season")
    private String season;

    @Column(name = "player_image_url")
    private String playerImageUrl;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public PlayerStats() {}

    public PlayerStats(String playerName, String position, String season) {
        this.playerName = playerName;
        this.position = position;
        this.season = season;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public String getPosition() { return position; }
    public void setPosition(String position) { this.position = position; }

    public Integer getJerseyNumber() { return jerseyNumber; }
    public void setJerseyNumber(Integer jerseyNumber) { this.jerseyNumber = jerseyNumber; }

    public Integer getAppearances() { return appearances; }
    public void setAppearances(Integer appearances) { this.appearances = appearances; }

    public Integer getGoals() { return goals; }
    public void setGoals(Integer goals) { this.goals = goals; }

    public Integer getAssists() { return assists; }
    public void setAssists(Integer assists) { this.assists = assists; }

    public Integer getYellowCards() { return yellowCards; }
    public void setYellowCards(Integer yellowCards) { this.yellowCards = yellowCards; }

    public Integer getRedCards() { return redCards; }
    public void setRedCards(Integer redCards) { this.redCards = redCards; }

    public Integer getMinutesPlayed() { return minutesPlayed; }
    public void setMinutesPlayed(Integer minutesPlayed) { this.minutesPlayed = minutesPlayed; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public String getPlayerImageUrl() { return playerImageUrl; }
    public void setPlayerImageUrl(String playerImageUrl) { this.playerImageUrl = playerImageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}