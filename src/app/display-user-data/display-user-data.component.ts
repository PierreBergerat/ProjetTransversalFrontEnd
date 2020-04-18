import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-user-data',
  templateUrl: './display-user-data.component.html',
  styleUrls: ['./display-user-data.component.css']
})
export class DisplayUserDataComponent implements OnInit {
  public j: Array<String>;
  public m: Array<Array<String>>;
  public k: Array<String>;
  public p: Array<String>;
  public rest;
  constructor(private router: Router, private httpClient: HttpClient, private cookieService: CookieService) {
    this.j = new Array<String>();
    this.m = new Array<Array<String>>();
    this.k = new Array<String>();
    this.p = new Array<String>();
  }
  ngOnInit(): void {
    this.httpClient.get("http://localhost:3000/livres", { responseType: 'json' }).subscribe(res => {
      this.j = res as Array<String>;
      this.rest = res;
      for (var i = 0; i < this.j.length; i++) {
        this.getImage(res[i].ISBN, i)
        this.getGenre(res[i].ID_Livre, i)
        this.getAuteur(res[i].ID_Livre, i)
      }
      console.log(this.j)
    })
    //console.log(this.k)
    this.verifCredit();
  }

  verifCredit() {
    var requestCredit = "http://localhost:3000/credits/verification/" + this.cookieService.get('ID_USER')
    this.httpClient.get(requestCredit, { responseType: 'text' }).subscribe(response => {
      var j = JSON.parse(response);
      if (j[0].Credits <= 0) {
        //console.log("true")
        Array.prototype.slice.call(document.getElementsByClassName('clickable')).forEach(elem => {
          elem.style.display = "none";
        })
      } else {
        Array.prototype.slice.call(document.getElementsByClassName('clickable')).forEach(elem => {
          elem.style.display = "";
        })
        console.log("assez de crédit")
      }

    })
  }

  getImage(ISBN: String, index: number) {
    //console.log(ISBN)
    var r = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + ISBN
    this.httpClient.get(r, { responseType: 'text' }).subscribe(reponse => {
      var json = JSON.parse(reponse);
      if (json.items) {
        if (json.items[0].volumeInfo.imageLinks) {
          this.k[index] = json.items[0].volumeInfo.imageLinks.thumbnail
        } else {
          this.k[index] = "assets/missingbook.png"
        }
      } else {
        this.k[index] = "assets/missingbook.png"
      }
    })
  }

  getGenre(ID_Livre: String, index: number) {
    var r = 'http://localhost:3000/liste/genres/' + ID_Livre
    this.httpClient.get(r, { responseType: 'json' }).subscribe(reponse => {
      this.m[index] = (reponse as Array<String>)
    })
  }
  getAuteur(ID_Livre: String, index: number) {
    var r = 'http://localhost:3000/liste/auteur/' + ID_Livre
    this.httpClient.get(r, { responseType: 'text' }).subscribe(reponse => {
      //console.log(reponse)
      var mgcstf = JSON.parse(reponse)
      this.p[index] = mgcstf;
    })
  }

  takeLivre(e: Event) {
    var ISBN = (e.currentTarget as HTMLButtonElement).parentElement.parentElement.parentElement.innerHTML.split("ISBN : ")[1].split('<')[0];
    (e.currentTarget as HTMLButtonElement).remove();
    for (var i = 0; i < this.j.length; i++) {
      if (this.rest[i].ISBN == ISBN) {
        var ID_LIVRE = this.rest[i].ID_Livre;
        var requetePrendreLivre = "http://localhost:3000/livres/prendre/" + ID_LIVRE + '/' + this.cookieService.get('ID_USER')
        this.httpClient.post(requetePrendreLivre, "", { responseType: 'text' }).subscribe(res => {
          var retirerCredit = "http://localhost:3000/credits/enlever/" + this.cookieService.get('ID_USER');
          this.httpClient.post(retirerCredit, "", { responseType: 'text' }).subscribe(r => {
            this.verifCredit();
            console.log(r)
          })
        })
      }
    }
  }

}
