import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { IvinService } from "./app/ivin.service";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate{
    
    constructor(private router: Router, private ivinService:IvinService){}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        // Check if the user is authenticated
        if (this.ivinService.isAuthenticated()) {
            return true; // User is authenticated, allow access
        } else {
            // User is not authenticated, redirect to the login page
            this.router.navigate(['/login']);
            return false;
        }
        
        
    }

}