import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ButtonModule } from 'primeng/button';

import { UserService } from '../../core/api/userService.service';
import { TweetService } from '../../core/api/tweetService.service';
import { GetTweetDTO } from '../../dto/tweet.dto';
import { createUserResponse } from '../../dto/user.dto';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit {
  searchControl = new FormControl('');
  activeTab: 'usuarios' | 'tweets' = 'usuarios';

  foundUser?: createUserResponse;
  userNotFound = false;
  isSearchingUser = false;

  allTweets: GetTweetDTO[] = [];
  filteredTweets: GetTweetDTO[] = [];
  isLoadingTweets = true;

  constructor(
    private userService: UserService,
    private tweetService: TweetService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.carregarTweets();

    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (this.activeTab === 'tweets') {
          this.filtrarTweets(value || '');
        }
      });
  }

  carregarTweets(): void {
    this.tweetService.getAllTweets().subscribe({
      next: (tweets) => {
        this.allTweets = tweets;
        this.filteredTweets = tweets;
        this.isLoadingTweets = false;
      },
      error: () => {
        this.isLoadingTweets = false;
      },
    });
  }

  buscar(): void {
    const query = this.searchControl.value?.trim();
    if (!query) return;

    if (this.activeTab === 'usuarios') {
      this.buscarUsuario(query);
    } else {
      this.filtrarTweets(query);
    }
  }

  buscarUsuario(username: string): void {
    this.isSearchingUser = true;
    this.foundUser = undefined;
    this.userNotFound = false;

    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        this.foundUser = user;
        this.isSearchingUser = false;
      },
      error: () => {
        this.userNotFound = true;
        this.isSearchingUser = false;
      },
    });
  }

  filtrarTweets(query: string): void {
    if (!query.trim()) {
      this.filteredTweets = this.allTweets;
      return;
    }
    const q = query.toLowerCase();
    this.filteredTweets = this.allTweets.filter(
      (t) =>
        t.text.toLowerCase().includes(q) || t.user.username.toLowerCase().includes(q),
    );
  }

  mudarTab(tab: 'usuarios' | 'tweets'): void {
    this.activeTab = tab;
    this.foundUser = undefined;
    this.userNotFound = false;
    if (tab === 'tweets') {
      this.filtrarTweets(this.searchControl.value || '');
    }
  }

  irParaPerfil(userId: bigint | undefined): void {
    if (!userId) return;
    this.router.navigate(['/user/profile', userId.toString()]);
  }
}
