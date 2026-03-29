import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';

import { UserService } from '../../core/api/userService.service';
import { SessionService } from '../../core/api/session.service';
import { User } from '../../interface/user';
import { TweetService } from '../../core/api/tweetService.service';
import { CreateTweetDTO, GetTweetDTO } from '../../dto/tweet.dto';
import { Router } from '@angular/router';

type CreateTweetForm = {
  userId: FormControl<bigint | null>;
  text: FormControl<string>;
};

@Component({
  selector: 'app-tweets',
  standalone: true,
  imports: [ReactiveFormsModule, ToastModule, ButtonModule],
  templateUrl: './tweets.html',
  styleUrl: './tweets.scss',
  providers: [MessageService],
})
export class Tweets implements OnInit {
  username = '';
  savedUser?: User;
  listaTweets: GetTweetDTO[] = [];

  postNewTweetForm = new FormGroup<CreateTweetForm>({
    userId: new FormControl<bigint | null>(null, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    text: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private tweetService: TweetService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetchUsername();
    if (this.username) {
      this.carregarInformacoesUsuario();
    }
    this.buscarTodosTweets();
  }

  fetchUsername(): void {
    const sessionUsername = this.sessionService.getUsername();
    let localUsername: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      localUsername = localStorage.getItem('username');
    }
    this.username = sessionUsername || localUsername || '';
  }

  carregarInformacoesUsuario(): void {
    this.userService.getUserByUsername(this.username).subscribe({
      next: (res: User) => {
        this.savedUser = res;
        this.postNewTweetForm.patchValue({ userId: res.id });
      },
      error: (err) => {
        const message =
          err?.error?.message || err?.message || 'Algo deu errado ao carregar usuário';
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: message,
          life: 5000,
        });
      },
    });
  }

  buscarTodosTweets(): void {
    this.tweetService.getAllTweets().subscribe({
      next: (res) => {
        this.listaTweets = res;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao buscar tweets',
          life: 5000,
        });
      },
    });
  }

  postarTweet(): void {
    if (this.postNewTweetForm.invalid) return;

    const raw = this.postNewTweetForm.getRawValue();
    if (raw.userId == null) return;

    const dto: CreateTweetDTO = { userId: raw.userId, text: raw.text };

    this.tweetService.postNewTweet(dto).subscribe({
      next: () => {
        this.postNewTweetForm.patchValue({ text: '' });
        this.buscarTodosTweets();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao postar tweet',
          life: 3000,
        });
      },
    });
  }

  redirecionarPerfil(userId: bigint | undefined): void {
    if (!userId) return;
    this.router.navigate(['/user/profile', userId.toString()]);
  }
}
