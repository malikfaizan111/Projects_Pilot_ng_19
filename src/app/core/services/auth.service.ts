import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  set isLoggedIn(value: boolean) {
    localStorage.setItem('isLoggedIn', value ? 'true' : 'false');
  }

}
