import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

import { TweetService } from '../../../core/api/tweetService.service';
import { SessionService } from '../../../core/api/session.service';
import { GetTweetDTO } from '../../../dto/tweet.dto';
import { User } from '../../../interface/user';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss',
})
export class UserProfile implements OnInit {
  userId = '';
  user?: User;
  tweets: GetTweetDTO[] = [];
  isLoading = true;
  isOwnProfile = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tweetService: TweetService,
    private sessionService: SessionService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('userId');
      if (id) {
        this.userId = id;
        this.carregarTweets();
      }
    });
  }

  carregarTweets(): void {
    this.isLoading = true;
    this.tweetService.getAllTweetsFromUser(this.userId).subscribe({
      next: (tweets) => {
        this.tweets = tweets;
        if (tweets.length > 0) {
          const profileUser = tweets[0].user;
          this.user = profileUser;
          this.isOwnProfile = profileUser.username === this.sessionService.getUsername();
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  voltar(): void {
    this.router.navigate(['/tweets']);
  }
}
