import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

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
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './tweets.html',
  styleUrl: './tweets.scss',
  providers: [MessageService]
})
export class Tweets implements OnInit {
  username = '';
  savedUser?: User;
  listaTweets: GetTweetDTO[] = [];
  loadingTweets = false;
  postingTweet = false;

  postNewTweetForm = new FormGroup<CreateTweetForm>({
    userId: new FormControl<bigint | null>(null, { nonNullable: true, validators: [Validators.required] }),
    text: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(280)] })
  });

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private tweetService: TweetService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router: Router
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

    if (!this.username) {
      this.router.navigate(['/user']);
    }
  }

  carregarInformacoesUsuario(): void {
    this.userService.getUserByUsername(this.username).subscribe({
      next: (res: User) => {
        this.savedUser = res;
        this.postNewTweetForm.patchValue({ userId: res.id });
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Sessão expirada',
          detail: 'Não foi possível carregar seu perfil. Faça login novamente.',
          life: 5000
        });
      }
    });
  }

  buscarTodosTweets(): void {
    this.loadingTweets = true;
    this.tweetService.getAllTweets().subscribe({
      next: (res: GetTweetDTO[]) => {
        this.listaTweets = res;
        this.loadingTweets = false;
      },
      error: () => {
        this.loadingTweets = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar os tweets',
          life: 5000
        });
      }
    });
  }

  postarTweet(): void {
    if (this.postNewTweetForm.invalid) return;

    const raw = this.postNewTweetForm.getRawValue();
    if (raw.userId == null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Você precisa estar logado para tweetar',
        life: 4000
      });
      return;
    }

    const dto: CreateTweetDTO = { userId: raw.userId, text: raw.text };
    this.postingTweet = true;

    this.tweetService.postNewTweet(dto).subscribe({
      next: () => {
        this.postingTweet = false;
        this.postNewTweetForm.patchValue({ text: '' });
        this.buscarTodosTweets();
      },
      error: () => {
        this.postingTweet = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível publicar o tweet',
          life: 4000
        });
      }
    });
  }

  get charCount(): number {
    return this.postNewTweetForm.get('text')?.value?.length ?? 0;
  }

  redirecionarPerfil(userId: bigint): void {
    this.router.navigate(['user/profile', userId.toString()]);
  }
}
