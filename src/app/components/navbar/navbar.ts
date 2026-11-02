import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent implements OnInit {

  userInitial: string = '';
  userEmail: string = '';
  showName: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {

    const email = localStorage.getItem('userEmail');

    if (email) {
      this.userEmail = email;
      this.userInitial = email.charAt(0).toUpperCase();
    } else {
      this.userInitial = 'U';
    }

  }

  toggleName() {
    this.showName = !this.showName;
  }

  logout() {
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

}
