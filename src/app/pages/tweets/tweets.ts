import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { UserService } from '../../core/api/userService.service';
import { SessionService } from '../../core/api/session.service';
import { User } from '../../interface/user';

@Component({
  selector: 'app-tweets',
  standalone: true,
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './tweets.html',
  styleUrl: './tweets.scss',
  providers: [MessageService]
})
export class Tweets implements OnInit {
  postNewTweetForm: FormGroup;
  username = '';
  savedUser?: User;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private sessionService: SessionService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.postNewTweetForm = this.fb.group({
      userId: ['', Validators.required],
      text: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchUsername();

    if (this.username) {
      this.carregarInformacoesUsuario();
    }
  }

  fetchUsername(): void {
    const sessionUsername = this.sessionService.getUsername();

    let localUsername: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      localUsername = localStorage.getItem('username');
    }

    this.username = sessionUsername || localUsername || '';
    console.log(this.username);

    if (!this.username == null) {
      this.messageService.add({
        severity: 'success',
        summary: 'Sucesso',
        detail: `Usuário: ${this.username} carregado com sucesso`,
        life: 3000
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não foi carregado direito',
        life: 4000
      });
    }
  }

  carregarInformacoesUsuario(): void {
    this.userService.getUserByUsername(this.username).subscribe({
      next: (res: User) => {
        this.savedUser = res;

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Informações do usuário carregadas',
          life: 2500
        });

        this.postNewTweetForm.patchValue({ userId: res.id });
      },
      error: (err) => {
        const message =
          err?.error?.message ||
          err?.message ||
          'Algo deu errado ao carregar usuário';

        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: message,
          life: 5000
        });
      }
    });
  }
}
