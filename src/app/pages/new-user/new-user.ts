import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormBuilder,FormControl,FormGroup } from '@angular/forms';
import { UserService } from '../../core/api/userService.service';
import {ToastModule} from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HealthDTO } from '../../dto/health.dto';

@Component({
  selector: 'app-new-user',
  imports: [ReactiveFormsModule,ToastModule],
  templateUrl: './new-user.html',
  styleUrl: './new-user.scss',
  providers: [MessageService]
})
export class NewUser {
  cadastrarUsuarioForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserService, private messageService:MessageService){
    this.cadastrarUsuarioForm = this.fb.group({
      nome: ['',Validators.required],
      avatar: ['',Validators.required]
    });
         
  }




  onSubmit(){
    console.log(this.cadastrarUsuarioForm);
    if(this.cadastrarUsuarioForm.valid){
      this.userService.getHealth().subscribe({
        next: (res:HealthDTO) => {
          console.log('Health: ',res);
          this.messageService.add({
            severity:'success',
            summary:'Sucesso',
            detail: res.mensagem
          })

        } ,
        error: (err) => console.log('Erro: ',err)
      });
    }else{
      console.error("Preencha todos os campos do formulário primeiro!");
      this.messageService.add({
        severity:'warn',
        summary: 'Aviso!',
        detail: 'Preencha todos os campos do formulário primeiro!'
      })
    }
  }

  clearFormulario(){
    this.cadastrarUsuarioForm.reset();
  }
}
