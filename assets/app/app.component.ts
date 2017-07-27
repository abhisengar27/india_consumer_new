import { Component} from '@angular/core';
import { Router, NavigationEnd} from "@angular/router";
@Component({
    selector: 'my-app',
    template: `<router-outlet ></router-outlet>`
})
export class AppComponent{

    constructor(private router: Router){
           this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        var metricValue = Math.random()*200;
        ga('set', 'LoanAmt', metricValue);
        ga('send', 'pageview');
      }
    })
    }
}
