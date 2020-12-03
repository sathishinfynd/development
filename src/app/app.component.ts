import {Component, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { Auth } from 'aws-amplify';
import { UtilityService } from '../app/services/utility.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'prime-connect';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(private router: Router, private idle: Idle, private keepalive: Keepalive, private utilityService: UtilityService ) {
    idle.setIdle((600 * 30) - 10);
    idle.setTimeout(10);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => { 
      this.idleState = 'No longer idle.';
      console.log(this.idleState);
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      console.log(this.idleState);
      Auth.signOut()
        .then(data => { this.router.navigate(['/auth/signin'])
      .then(() => {
        window.location.reload();
      });
    })
        .catch(err => {console.log(err)});
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You have gone idle!';
      console.log(this.idleState);
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will time out in ' + countdown + ' seconds!';
      console.log(this.idleState);
    });

    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.utilityService.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch();
        this.timedOut = false;
      } else {
        idle.stop();
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
