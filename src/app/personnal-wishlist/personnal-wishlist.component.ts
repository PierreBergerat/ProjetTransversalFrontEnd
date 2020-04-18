import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-personnal-wishlist',
  templateUrl: './personnal-wishlist.component.html',
  styleUrls: ['./personnal-wishlist.component.css']
})
export class PersonnalWishlistComponent implements OnInit {
  public j: Array<any>;
  constructor(private cookieService: CookieService, private router: Router, private httpClient: HttpClient) { this.j = new Array<any>() }



  ngOnInit(): void {
    this.getInterets()
  }

  getInterets() {
    var i = 0;
    var requete = "http://localhost:3000/livres/interetsPERSONNE/" + this.cookieService.get('ID_USER');
    this.httpClient.get(requete, { responseType: 'text' }).subscribe(res => {
      Array.prototype.slice.call(JSON.parse(res)).forEach(elem => {
        var apiRequest = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + elem.ISBN_livre
        this.httpClient.get(apiRequest, { responseType: 'text' }).subscribe(resultats => {
          this.j[i] = JSON.parse(resultats).items[0]
          i++;
        })
      })
    })
    console.log(this.j)
  }


  delete(e: Event) {
  var destroyRequest = "http://localhost:3000/livres/interets/" + (e.currentTarget as HTMLButtonElement).parentElement.parentElement.parentElement.innerHTML.split("ISBN : ")[1].split("<")[0] + '/' + this.cookieService.get('ID_USER')
  this.httpClient.delete(destroyRequest).subscribe(res => {
    console.log(res)
  });
  (e.currentTarget as HTMLButtonElement).parentElement.parentElement.parentElement.remove()

  }
}
