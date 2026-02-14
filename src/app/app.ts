import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from "primeng/toast";
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast,ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Tweetero-Angular');
}
