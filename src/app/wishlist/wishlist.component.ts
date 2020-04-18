import { CookieService } from 'ngx-cookie-service';
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
  isbn = "isbn%3D"
  public j: any[];
  @ViewChild('request') request: ElementRef;
  constructor(private formBuilder: FormBuilder, private router: Router, private httpClient: HttpClient, private cookieService: CookieService) {
    this.checkoutForm = this.formBuilder.group({});
  }

  gotoListSouhait() {
    this.router.navigate[('/wishlistpersonnal')]
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
    var requeteAjoutInteret = "http://localhost:3000/livres/interets/" + ISBN + '/' + this.cookieService.get('ID_USER')
    this.httpClient.post(requeteAjoutInteret, "", { responseType: 'text' }).subscribe(res => {
      console.log(res)
    });
    (event.currentTarget as HTMLButtonElement).remove()
  }
  ngOnInit(): void {

  }

}
