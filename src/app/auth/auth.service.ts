import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {User} from './user.model';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import * as fromAuthActions from './store/auth.action';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) {
  }

  setLogoutTimer(expirationDuraton: number) {
    setTimeout(() => {
      this.store.dispatch(new fromAuthActions.Logout());
    }, expirationDuraton);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}


