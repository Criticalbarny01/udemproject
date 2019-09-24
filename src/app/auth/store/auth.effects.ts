import {Actions, Effect, ofType} from '@ngrx/effects';
import * as fromAuthActions from './auth.action';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {AuthResponseData, AuthService} from '../auth.service';
import {HttpClient} from '@angular/common/http';
import {from, of, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {User} from '../user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

const handleAuth = (expiresIn: number, email: string, userId: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new fromAuthActions.Login({
    email,
    userId,
    token,
    expirationDate
  });
};

const handleError = (error: any) => {
  let errorMessage = 'An unknown error occurred!';
  if (!error.error || !error.error.error) {
    return of(new fromAuthActions.LoginFail(errorMessage));
  }
  switch (error.error.error.message) {
    case 'EMAIL_EXISTS':
      errorMessage = 'This email exists';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMessage = 'This email does not exists';
      break;
    case 'INVALID_PASSWORD':
      errorMessage = 'This password is not correct';
      break;
  }
  return of(new fromAuthActions.LoginFail(errorMessage));
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(fromAuthActions.SIGNUP_START), switchMap(
      (signupAction: fromAuthActions.SignupStart) => {
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
          'AIzaSyDXXgYpsjXq5lULQThWih9eqt-2SkMWK7A', {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }).pipe(tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }), map(resData => {
          return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
        }), catchError(error => {
          return handleError(error);
        }));
      }
    )
  );

  @Effect()
  authLogin = this.actions$.pipe(ofType(
    fromAuthActions.LOGIN_START),
    switchMap((authData: fromAuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        'AIzaSyDXXgYpsjXq5lULQThWih9eqt-2SkMWK7A',
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(tap(resData => {
        this.authService.setLogoutTimer(+resData.expiresIn * 1000);
      }), map(resData => {
        return handleAuth(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
      }), catchError(error => {
        return handleError(error);
      }));
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(ofType(fromAuthActions.LOGIN), tap(() => {
    this.router.navigate(['/']);
  }));

  @Effect()
  autoLogin = this.actions$.pipe(ofType(fromAuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string,
        id: string,
        token: string,
        tokenExpirationDate: string,

      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return {type: 'DUMMy'};
      }

      const loadedUser = new User(userData.email, userData.id, userData.token, new Date(userData.tokenExpirationDate));
      if (loadedUser.token) {
        // this.user.next(loadedUser);
        const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new fromAuthActions.Login({
            email: loadedUser.email, userId: loadedUser.id, token: loadedUser.token, expirationDate: new Date(userData.tokenExpirationDate)
          }
        );
        // this.autoLogout(expirationDuration);
      }
      return {type: 'DUMMY'};
    }));

  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(ofType(fromAuthActions.LOGOUT), tap(() => {
    this.authService.clearLogoutTimer();
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {

  }
}
