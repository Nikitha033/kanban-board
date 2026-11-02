import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  email: string = '';
  password: string = '';
  message: string = '';

  constructor(private router: Router) {}

  signup(){

    if(!this.email || !this.password){
      this.message = "Please fill all fields";
      return;
    }

    const user = {
      email: this.email,
      password: this.password
    };

    localStorage.setItem('user', JSON.stringify(user));

    this.message = "Signup successful! Please login.";

    setTimeout(()=>{
      this.router.navigate(['/login']);
    },1500);

  }

}
