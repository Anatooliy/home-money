import { 
    CanActivate, 
    CanActivateChild, 
    ActivatedRouteSnapshot, 
    RouterStateSnapshot, 
   // UrlTree,
    Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild{

    constructor(private authService: AuthService, private router: Router){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        if(this.authService.isLoggedIn()){
            console.log('is loginned');
            return true;
        }
        else{
            this.router.navigate(['/login'], {
                queryParams: {
                    accessDenied: true
                }
            });
            console.log('not loginned');
            return false;
        }
    };
    
    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.canActivate(childRoute, state)
    };
}