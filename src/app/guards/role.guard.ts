import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';
// import { TokenStorageService } from '../../../services/token-storage.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/authentication/login']);
      return false;
    }

    const user = this.tokenService.getUserSession();
    if (!user) {
      this.router.navigate(['/authentication/login']);
      return false;
    }

    if (state.url.startsWith('/admin')) {
      if (user.role === 'superadmin') {
        if (
          state.url === '/admin/create-code' ||
          state.url === '/admin/code-list'
        ) {
          return true;
        } else {
          this.router.navigate(['/admin/create-code']);
          return false;
        }
      } else if (user.role === 'client') {
        if (
          state.url === '/admin/create-code' ||
          state.url === '/admin/code-list'
        ) {
          this.router.navigate(['/admin/dashboard']);
          return false;
        } else {
          return true;
        }
      }
    }
    return true;
  }
}
