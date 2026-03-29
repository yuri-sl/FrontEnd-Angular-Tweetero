import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { SessionService } from '../../core/api/session.service';
import { UserService } from '../../core/api/userService.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit {
  username = '';

  constructor(
    private sessionService: SessionService,
    private userService: UserService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.username = this.sessionService.getUsername();
  }

  irParaPerfil(): void {
    const username = this.sessionService.getUsername();
    if (!username) return;

    this.userService.getUserByUsername(username).subscribe({
      next: (user) => {
        if (user.id) {
          this.router.navigate(['/user/profile', user.id.toString()]);
        }
      },
    });
  }

  sair(): void {
    this.sessionService.clearUsername();
    this.router.navigate(['/user']);
  }
}
