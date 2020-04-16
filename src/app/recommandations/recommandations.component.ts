import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recommandations',
  templateUrl: './recommandations.component.html',
  styleUrls: ['./recommandations.component.css']
})
export class RecommandationsComponent implements OnInit {
public j;
  constructor(private router: Router, private httpClient: HttpClient) { }

  ngOnInit(): void {
    //requeteBoth
    //requeteAuteur
    //requeteGenre
  }

}
