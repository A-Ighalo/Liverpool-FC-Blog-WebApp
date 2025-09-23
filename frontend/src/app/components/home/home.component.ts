import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogService } from '../../services/blog.service';
import { StatsService } from '../../services/stats.service';
import { BlogPost } from '../../models/blog.model';
import { PlayerStats, Fixture } from '../../models/stats.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  latestPosts: BlogPost[] = [];
  upcomingFixtures: Fixture[] = [];
  recentFixtures: Fixture[] = [];
  topScorers: PlayerStats[] = [];
  loading = true;

  constructor(
    private blogService: BlogService,
    private statsService: StatsService
  ) { }

  ngOnInit(): void {
    this.loadHomeData();
  }

  loadHomeData(): void {
    // Load latest blog posts
    this.blogService.getPublishedPosts(0, 3).subscribe({
      next: (data) => {
        this.latestPosts = data.content;
      },
      error: (error) => console.error('Error loading blog posts:', error)
    });

    // Load upcoming fixtures
    this.statsService.getUpcomingFixtures().subscribe({
      next: (data) => {
        this.upcomingFixtures = data.slice(0, 3);
      },
      error: (error) => console.error('Error loading upcoming fixtures:', error)
    });

    // Load recent fixtures
    this.statsService.getRecentFixtures().subscribe({
      next: (data) => {
        this.recentFixtures = data.slice(0, 3);
      },
      error: (error) => console.error('Error loading recent fixtures:', error)
    });

    // Load top scorers
    this.statsService.getTopScorers().subscribe({
      next: (data) => {
        this.topScorers = data.slice(0, 5);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading top scorers:', error);
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }
}