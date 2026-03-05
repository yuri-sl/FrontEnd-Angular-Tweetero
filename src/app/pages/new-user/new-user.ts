import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder,FormGroup } from '@angular/forms';
import { UserService } from '../../core/api/userService.service';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HealthDTO } from '../../dto/health.dto';
import { TweetService } from '../../core/api/tweetService.service';
import { createUserRequest, createUserResponse } from '../../dto/user.dto';
import {Router} from '@angular/router';
import { SessionService } from '../../core/api/session.service';
import {ButtonModule} from 'primeng/button'


@Component({
  selector: 'app-new-user',
  imports: [ReactiveFormsModule, ToastModule,ButtonModule],
  templateUrl: './new-user.html',
  styleUrl: './new-user.scss'
})
export class NewUser implements OnInit {
  cadastrarUsuarioForm!: FormGroup;
  fazerLoginForm!:FormGroup;
  fazerLogin: boolean = true;

  constructor(private fb: FormBuilder,
      private userService: UserService,
      private tweetService: TweetService,
      private messageService:MessageService,
      private sessionService:SessionService,
      private router:Router
  ){
    this.cadastrarUsuarioForm = this.fb.group({
      username: ['',Validators.required],
      avatar: ['',Validators.required]
    });
    this.fazerLoginForm = this.fb.group({
      nome:['',Validators.required]
    })
         
  }


  ngOnInit():void{
    this.getHealthFunction();
  }




  onSubmit(){
    console.log(this.cadastrarUsuarioForm);
    console.log(this.cadastrarUsuarioForm.valid);
    if(this.cadastrarUsuarioForm.valid){
      console.log("enviado");
      let body = this.cadastrarUsuarioForm.value as createUserRequest;
      this.userService.createUserRequest(body).subscribe({
        next: (res:createUserResponse) => {
          this.messageService.add({
            severity:'success',
            summary:'sucesso',
            detail:'Usuário criado com sucesso'
          })
          let savedUsername = this.cadastrarUsuarioForm.value.username;
          this.sessionService.setUsername(savedUsername);
          localStorage.setItem('username',savedUsername);
          this.router.navigate(['/tweets']);
        },
        error:(err) => {
          let detail = 'Erro ao cadastrar usuário';

          if(typeof err?.error === 'string' && err.error.trim()) {
            detail = err.error;
          }
          this.messageService.add({
            severity:'error',
            summary:'erro',
            detail:detail,
            life:5000
          });
        }
      })
    }else{
      console.error("Preencha todos os campos do formulário primeiro!");
      this.messageService.add({
        severity:'warn',
        summary: 'Aviso!',
        detail: 'Preencha todos os campos do formulário primeiro!'
      })
    }
  }

  getHealthFunction(){
      this.userService.getHealth().subscribe({
      next: (res:HealthDTO) => {
        console.log('Health: ',res);
        this.messageService.add({
          severity:'success',
          summary:'Sucesso',
          detail: res.mensagem,
          life:8000
        })
      } ,
      error: (err) => {
        this.messageService.add({
          severity:'warn',
          summary:'Aviso',
          detail: err.error?.message,
          life:5000,
          sticky:false,
          closable:true
        });
      }
    });
  }
  clearFormulario(){
    this.cadastrarUsuarioForm.reset();
  }

  alternarLoginCadastro(){
    this.fazerLogin = !this.fazerLogin;
  }
}
