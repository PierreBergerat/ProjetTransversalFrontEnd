import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookShare';
  public nomEtCredits;

  ngAfterViewInit() {
    if (this.CookieService.get('ID_USER')) {
      var requestCredit = "http://localhost:3000/credits/verification/" + this.CookieService.get('ID_USER')
      this.httpClient.get(requestCredit, { responseType: 'text' }).subscribe(response => {
        this.httpClient.get("http://localhost:3000/clients", { responseType: 'text' }).subscribe(res => {
          for (var i = 0; i < JSON.parse(res).length; i++) {
            if (JSON.parse(res)[i].ID_personne == this.CookieService.get('ID_USER')) {
              this.nomEtCredits =JSON.parse(res)[i].Prenom + ' (' + JSON.parse(response)[0].Credits + ' CR)'
            }
          }
          document.getElementById('nomCredits').innerHTML = this.nomEtCredits;
          console.log(this.nomEtCredits)
        });
      })
    }
  }
  hasCookie() {
    return this.CookieService.get('ID_USER');
  }
  deleteCookie() {
    //console.log("click")
    this.CookieService.deleteAll();
  }
  constructor(private CookieService: CookieService, private httpClient: HttpClient) { }
}
