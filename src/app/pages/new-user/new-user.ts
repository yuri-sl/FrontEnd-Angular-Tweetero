import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../core/api/userService.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HealthDTO } from '../../dto/health.dto';
import { createUserRequest, createUserResponse } from '../../dto/user.dto';
import { Router } from '@angular/router';
import { SessionService } from '../../core/api/session.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, ToastModule, ButtonModule],
  providers: [MessageService],
  templateUrl: './new-user.html',
  styleUrl: './new-user.scss',
})
export class NewUser implements OnInit {
  loginForm!: FormGroup;
  cadastroForm!: FormGroup;
  fazerLogin: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
    });

    this.cadastroForm = this.fb.group({
      username: ['', Validators.required],
      avatar: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getHealthFunction();
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso!',
        detail: 'Preencha o nome de usuário',
      });
      return;
    }

    const username = this.loginForm.value.username as string;

    this.userService.getUserByUsername(username).subscribe({
      next: (res: createUserResponse) => {
        this.sessionService.setUsername(res.username);
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: `Bem-vindo, ${res.username}!`,
          life: 3000,
        });
        this.router.navigate(['/tweets']);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Usuário não encontrado. Verifique o nome de usuário.',
          life: 5000,
        });
      },
    });
  }

  onRegister(): void {
    if (this.cadastroForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso!',
        detail: 'Preencha todos os campos do formulário primeiro!',
      });
      return;
    }

    const body = this.cadastroForm.value as createUserRequest;

    this.userService.createUserRequest(body).subscribe({
      next: (res: createUserResponse) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário criado com sucesso',
        });
        this.sessionService.setUsername(res.username);
        this.router.navigate(['/tweets']);
      },
      error: (err) => {
        let detail = 'Erro ao cadastrar usuário';
        if (typeof err?.error === 'string' && err.error.trim()) {
          detail = err.error;
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: detail,
          life: 5000,
        });
      },
    });
  }

  getHealthFunction(): void {
    this.userService.getHealth().subscribe({
      next: (res: HealthDTO) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Servidor online',
          detail: res.mensagem,
          life: 5000,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Aviso',
          detail: 'Servidor indisponível no momento',
          life: 5000,
          closable: true,
        });
      },
    });
  }

  alternarLoginCadastro(): void {
    this.fazerLogin = !this.fazerLogin;
    this.loginForm.reset();
    this.cadastroForm.reset();
  }
}
