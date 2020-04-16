import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display-user-data',
  templateUrl: './display-user-data.component.html',
  styleUrls: ['./display-user-data.component.css']
})
export class DisplayUserDataComponent implements OnInit {
  public j;
  constructor(private router: Router, private httpClient: HttpClient) { }
  ngOnInit(): void {
    this.httpClient.get("http://localhost:3000/livres", { responseType: 'text' }).subscribe(res => {
      console.log(res);
      var j = JSON.parse(res);
    })
  }
}
