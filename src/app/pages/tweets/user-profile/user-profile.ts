import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TweetService } from '../../../core/api/tweetService.service';
import { GetTweetDTO } from '../../../dto/tweet.dto';
import { User } from '../../../interface/user';

@Component({
  selector: 'app-user-profile',
  imports: [],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfile implements OnInit {
  userId!: bigint;
  user: User | null = null;
  tweets: GetTweetDTO[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tweetService: TweetService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('userId');
      if (id) {
        this.userId = BigInt(id);
        this.carregarPerfil();
      }
    });
  }

  carregarPerfil(): void {
    this.loading = true;
    this.tweetService.getAllTweetsFromUser(this.userId.toString()).subscribe({
      next: (tweets: GetTweetDTO[]) => {
        this.tweets = tweets;
        if (tweets.length > 0) {
          this.user = tweets[0].user;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  get avatarInitial(): string {
    return (this.user?.username?.toString() ?? 'U').charAt(0).toUpperCase();
  }

  voltarParaFeed(): void {
    this.router.navigate(['/tweets']);
  }
}
