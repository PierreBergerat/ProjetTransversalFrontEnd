import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookShare';
  hasCookie() {
   return this.CookieService.get('ID');
  }
  deleteCookie(){
    console.log("click")
    this.CookieService.deleteAll();
  }
  constructor(private CookieService: CookieService) { }
}
