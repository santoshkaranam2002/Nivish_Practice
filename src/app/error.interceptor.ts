import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 403) {
          // Handle the 403 error here
          // You can redirect to a custom error page or display a specific message
          // For example, you can use a router to navigate to an error component
          // or show a snackbar/toast message informing the user about the error.
          // You can also log the error or perform any other necessary actions.

          // Example: Redirecting to a custom error page
          // this.router.navigate(['/error-page']);

          // Example: Displaying a message
          // this.snackbar.open('Access Denied', 'Dismiss');

          // Return an empty observable to prevent the error from being propagated further
          return throwError('');
        }

        // For other error codes, simply pass the error along
        return throwError(error);
      })
    );
  }
}
