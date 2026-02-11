import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="login-box">

      <h2>Login</h2>

      <input [(ngModel)]="username" placeholder="Username">
      <input [(ngModel)]="password" type="password" placeholder="Password">

      <button (click)="login()">Login</button>

      <p *ngIf="error" class="error">
        Invalid username or password
      </p>

    </div>
  `,
  styles: [`
    .login-box{
      max-width:400px;
      margin:100px auto;
      display:flex;
      flex-direction:column;
      gap:12px;
    }

    input{
      padding:8px;
    }

    button{
      padding:10px;
      cursor:pointer;
    }

    .error{
      color:red;
    }
  `]
})
export class LoginComponent {

  username = '';
  password = '';
  error = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  login() {

    this.auth.login({
      username: this.username,
      password: this.password
    }).subscribe({

      next: () => {

        this.auth.loadUser();

        const returnUrl =
          this.route.snapshot.queryParams['returnUrl'] || '/calendar';

        this.router.navigate([returnUrl]);
      },

      error: () => {
        this.error = true;
      }

    });
  }
}
