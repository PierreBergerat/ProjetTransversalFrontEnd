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
  constructor(private router: Router, private httpClient: HttpClient) {
    this.j = new Array<String>();
    this.m = new Array<Array<String>>();
    this.k = new Array<String>();
    this.p = new Array<String>();
  }
  ngOnInit(): void {
    this.httpClient.get("http://localhost:3000/livres", { responseType: 'json' }).subscribe(res => {
      this.j = res as Array<String>;
      for (var i = 0; i < this.j.length; i++) {
        this.getImage(res[i].ISBN, i)
        this.getGenre(res[i].ID_Livre, i)
        this.getAuteur(res[i].ID_Livre, i)
      }
    })
    console.log(this.k)
  }

  getImage(ISBN: String, index: number) {
    console.log(ISBN)
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
      console.log(reponse)
      var mgcstf = JSON.parse(reponse)
      this.p[index] = mgcstf;
    })
  }
}
