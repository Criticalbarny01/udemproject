import {Component, OnInit} from '@angular/core';
import * as fromApp from './store/app.reducer';
import * as fromAuthActions from './auth/store/auth.action';
import {LoggingService} from './logging.service';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private store: Store<fromApp.AppState>, private loggingService: LoggingService) {
  }

  ngOnInit() {
    this.store.dispatch(new fromAuthActions.AutoLogin());
    this.loggingService.printLog('Hello form AppComp NgOnInit');
  }
}
