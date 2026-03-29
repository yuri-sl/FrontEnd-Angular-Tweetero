import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TweetService } from '../../core/api/tweetService.service';
import { SessionService } from '../../core/api/session.service';
import { GetTweetDTO } from '../../dto/tweet.dto';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications implements OnInit {
  recentActivity: GetTweetDTO[] = [];
  isLoading = true;
  username = '';

  constructor(
    private tweetService: TweetService,
    private sessionService: SessionService,
    private router: Router,
  ) {
    this.username = this.sessionService.getUsername();
  }

  ngOnInit(): void {
    this.carregarAtividades();
  }

  carregarAtividades(): void {
    this.tweetService.getAllTweets().subscribe({
      next: (tweets) => {
        this.recentActivity = tweets
          .filter((t) => t.user.username !== this.username)
          .slice(0, 20);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  irParaPerfil(userId: bigint | undefined): void {
    if (!userId) return;
    this.router.navigate(['/user/profile', userId.toString()]);
  }
}
