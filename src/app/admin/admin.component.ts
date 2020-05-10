import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public list: Array<any>
  constructor(private cookieService: CookieService, private router: Router, private httpClient: HttpClient) { this.list = new Array<any>() }

  ngOnInit(): void {
    if (!this.cookieService.get('IS_ADMIN')) {
      this.router.navigate(["/"])
    }
    this.httpClient.get("http://localhost:3000/clients", { responseType: 'text' }).subscribe(res => {
      this.list = JSON.parse(res);
      this.sortByName();
    })
  }
  sortByName() {
  this.list = this.list.sort(function IHaveAName(a, b) {
    return b.Nom < a.Nom ? 1
      : b.Nom > a.Nom ? -1
        : 0;
  });
  }
  sortBySurname() {
  this.list = this.list.sort(function IHaveAName(a, b) {
    return b.Prenom < a.Prenom ? 1
      : b.Prenom > a.Prenom ? -1
        : 0;
  });
  }
  sortByCredits() {
  this.list = this.list.sort(function IHaveAName(a, b) {
    return b.Credits < a.Credits ? 1
      : b.Credits > a.Credits ? -1
        : 0;
  });
  }
}
