import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
    userId: FormControl<bigint|null>;
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



  postNewTweetForm = new FormGroup<CreateTweetForm>({
    userId: new FormControl<bigint|null>(null,{nonNullable:true,validators:[Validators.required]}),
    text: new FormControl<string>('',{nonNullable:true, validators: [Validators.required]})
  })
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private messageService: MessageService,
    private sessionService: SessionService,
    private tweetService: TweetService,
    @Inject(PLATFORM_ID) private platformId: object,
    private router:Router
  ) {
  }

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
  buscarTodosTweets(){
    this.tweetService.getAllTweets().subscribe({
      next:(res) => {
        console.log(res)
        this.listaTweets = res;
        this.messageService.add({
          severity:'Success',
          summary:'Sucesso',
          detail:'Sucesso em buscar mensagens',
          life:5000
        })
      },
      error:(err) => {
        console.error(err);
          this.messageService.add({
          severity:'error',
          summary:'Erro',
          detail:'Erro em buscar mensagens',
          life:5000
        })
      }
    })

  }

  postarTweet():void{

    if(this.postNewTweetForm.invalid){
      return
    }
    //Extrair o raw value
    const raw = this.postNewTweetForm.getRawValue();
    
    if(raw.userId == null){
      return
    }

    //Montar DTO
    const dto:CreateTweetDTO = {
      userId: raw.userId,
      text: raw.text
    }
    this.tweetService.postNewTweet(dto).subscribe({
      next:(res) => console.log(res),
      error:(err) => console.error(err)
    })

  }
  redirecionarPerfil(userId:bigint){
    this.router.navigate(['user/profile',userId])
  }
}
