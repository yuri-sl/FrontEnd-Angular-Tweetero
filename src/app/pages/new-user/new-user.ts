import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../../core/api/userService.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { createUserRequest, createUserResponse } from '../../dto/user.dto';
import { Router } from '@angular/router';
import { SessionService } from '../../core/api/session.service';

@Component({
  selector: 'app-new-user',
  imports: [ReactiveFormsModule, ToastModule],
  templateUrl: './new-user.html',
  styleUrl: './new-user.scss'
})
export class NewUser implements OnInit {
  cadastrarUsuarioForm!: FormGroup;
  fazerLoginForm!: FormGroup;
  fazerLogin = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.cadastrarUsuarioForm = this.fb.group({
      username: ['', Validators.required],
      avatar: ['', Validators.required]
    });
    this.fazerLoginForm = this.fb.group({
      nome: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checkServerHealth();
  }

  /* Login — look up existing user by username */
  loginSubmit(): void {
    if (this.fazerLoginForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Informe seu nome de usuário'
      });
      return;
    }

    this.loading = true;
    const nome = this.fazerLoginForm.value.nome as string;

    this.userService.getUserByUsername(nome).subscribe({
      next: (res: createUserResponse) => {
        this.loading = false;
        this.sessionService.setUsername(res.username as string);
        localStorage.setItem('username', res.username as string);
        this.messageService.add({
          severity: 'success',
          summary: 'Bem-vindo!',
          detail: `Olá, ${res.username}!`,
          life: 2500
        });
        setTimeout(() => this.router.navigate(['/tweets']), 600);
      },
      error: () => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Usuário não encontrado',
          detail: 'Verifique o nome de usuário ou crie uma conta',
          life: 5000
        });
      }
    });
  }

  /* Register — create a new user */
  onSubmit(): void {
    if (this.cadastrarUsuarioForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Aviso',
        detail: 'Preencha todos os campos do formulário'
      });
      return;
    }

    this.loading = true;
    const body = this.cadastrarUsuarioForm.value as createUserRequest;

    this.userService.createUserRequest(body).subscribe({
      next: (res: createUserResponse) => {
        this.loading = false;
        const savedUsername = res.username as string;
        this.sessionService.setUsername(savedUsername);
        localStorage.setItem('username', savedUsername);
        this.messageService.add({
          severity: 'success',
          summary: 'Conta criada!',
          detail: `Bem-vindo, ${savedUsername}!`,
          life: 2500
        });
        setTimeout(() => this.router.navigate(['/tweets']), 600);
      },
      error: (err) => {
        this.loading = false;
        const detail =
          typeof err?.error === 'string' && err.error.trim()
            ? err.error
            : 'Erro ao criar conta. Tente outro nome de usuário.';
        this.messageService.add({ severity: 'error', summary: 'Erro', detail, life: 5000 });
      }
    });
  }

  alternarLoginCadastro(): void {
    this.fazerLogin = !this.fazerLogin;
    this.fazerLoginForm.reset();
    this.cadastrarUsuarioForm.reset();
  }

  private checkServerHealth(): void {
    this.userService.getHealth().subscribe({
      next: () => {},          // silently confirms API is reachable
      error: () => {
        this.messageService.add({
          severity: 'warn',
          summary: 'Servidor indisponível',
          detail: 'Não foi possível conectar ao servidor. Tente mais tarde.',
          life: 6000
        });
      }
    });
  }
}
