import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  signup(email: string, password: string) {

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    users.push({ email, password });

    localStorage.setItem('users', JSON.stringify(users));
  }

  login(email: string, password: string): boolean {

    const users = JSON.parse(localStorage.getItem('users') || '[]');

    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem('loggedUser', email);
      return true;
    }

    return false;
  }

  logout() {
    localStorage.removeItem('loggedUser');
  }

  isLoggedIn() {
    return localStorage.getItem('loggedUser') !== null;
  }
}