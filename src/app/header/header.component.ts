import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataStorageService} from '../shared/data-storage.service';
import {AuthService} from '../auth/auth.service';
import {Subscription} from 'rxjs';
import * as fromApp from '../store/app.reducer';
import {Store} from '@ngrx/store';
import {map} from 'rxjs/operators';
import * as fromAuthActions from '../auth/store/auth.action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(private dataStorageService: DataStorageService, private authService: AuthService, private store: Store<fromApp.AppState>) {
  }

  ngOnInit() {
    this.userSub =  this.store.select('auth').pipe(map(authSate => authSate.user
    )).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.dataStorageService.storeRecipe();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
   this.store.dispatch(new fromAuthActions.Logout());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}




