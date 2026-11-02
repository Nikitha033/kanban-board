import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private router: Router) {}

  login(){

    const storedUser = localStorage.getItem('user');

    if(!storedUser){
      this.message = "Please sign up first!";
      return;
    }

    const user = JSON.parse(storedUser);

    if(this.email !== user.email){
      this.message = "User not found!";
      return;
    }

    if(this.password !== user.password){
      this.message = "Incorrect password!";
      return;
    }

    localStorage.setItem('userEmail', this.email);

    this.router.navigate(['/kanban']);

  }

}
