import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {
  checkoutForm;
  api = "https://www.googleapis.com/books/v1/volumes?q=";
  isbn = "isbn:"
  public j: any[];
  @ViewChild('request') request: ElementRef;
  constructor(private formBuilder: FormBuilder, private router: Router, private httpClient: HttpClient) {
    this.checkoutForm = this.formBuilder.group({});
  }
  onSubmit() {
    if (this.request) {
      if (this.request.nativeElement.value.match(/^[0-9-]*$/) != null) {
        var requestApi = this.api.concat(this.isbn.concat(this.request.nativeElement.value.replace("-", "")));
        this.httpClient.get<any[]>(requestApi).subscribe(res => {
          console.log(res);
          this.j = res['items'];
        })
      } else {
        var requestApi = this.api.concat(this.request.nativeElement.value.replace(" ", "+"));
        this.httpClient.get<any[]>(requestApi).subscribe(res => {
          console.log(res);
          this.j = res['items'];
        }
        )
      }
    }
  }

  test(event: any) {
    var temp = ((((event.target.parentElement).parentElement).parentElement).innerText.split("ISBN : "));
    var ISBN = temp[temp.length - 1]
    //requeteGoogleGetLivreInfo
    //requetePostInteretLivre
    console.warn(ISBN);
  }
  ngOnInit(): void {
  }

}
