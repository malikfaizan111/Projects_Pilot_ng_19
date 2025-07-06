import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly Router: Router
  ) {}

  canActivate(): boolean {
    if (!this.authService.isLoggedIn) {
      return true;
    } else {
      this.Router.navigateByUrl('/projects');
      return false;
    }
  }
}
