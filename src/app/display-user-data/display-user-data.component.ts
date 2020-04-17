import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { isBoolean } from 'util';

@Component({
  selector: 'app-display-user-data',
  templateUrl: './display-user-data.component.html',
  styleUrls: ['./display-user-data.component.css']
})
export class DisplayUserDataComponent implements OnInit {
  public j: Array<String>;
  public m: Array<Array<String>>;
  public k: Array<String>;
  constructor(private router: Router, private httpClient: HttpClient) { this.j = new Array<String>(); this.m = new Array<Array<String>>(); this.k = new Array<String>() }
  ngOnInit(): void {
    this.httpClient.get("http://localhost:3000/livres", { responseType: 'text' }).subscribe(res => {
      this.j = JSON.parse(res);
      var temp = JSON.parse(res);
      for (var i = 0; i < this.j.length; i++) {
        this.getImage(temp[i].ISBN)
        this.getGenre(temp[i].ID_Livre)
      }
    })
  }

  getImage(ISBN: String) {
    var r = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + ISBN
    this.httpClient.get(r, { responseType: 'text' }).subscribe(reponse => {
      var json = JSON.parse(reponse);
      if(json.items[0].volumeInfo.imageLinks){
        this.k.push(json.items[0].volumeInfo.imageLinks.thumbnail)
      } else {
        this.k.push("assets/missingbook.png")
      }
    })
  }

  getGenre(ID_Livre: String) {
    var r = 'http://localhost:3000/liste/genres/' + ID_Livre
    this.httpClient.get(r, { responseType: 'json' }).subscribe(reponse => {
      this.m.push(reponse as Array<String>)
    })
  }
}
