import { CookieService } from 'ngx-cookie-service';
import { Livre } from './../Class/livre';
import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css'],
})
export class FrontpageComponent implements OnInit {
  @ViewChild('titre') titre: ElementRef;
  @ViewChild('auteur') auteur: ElementRef;
  @ViewChild('description') description: ElementRef;
  @ViewChild('genre') genre: ElementRef;
  @ViewChild('genre') genretab: Array<HTMLSelectElement>
  @ViewChild('edition') edition: ElementRef;
  @ViewChild('anneeParution') anneeParution: ElementRef;
  @ViewChild('langue') langue: ElementRef;
  @ViewChild('valider') valider: ElementRef;
  @ViewChild('error') error: ElementRef;
  @ViewChild('anchor') ancre: ElementRef;
  @ViewChild('miniature') miniature: ElementRef;
  api = "https://www.googleapis.com/books/v1/volumes?q=isbn:";
  request = "";
  checkoutForm;
  constructor(private httpClient: HttpClient, private router: Router, private formBuilder: FormBuilder, private cookieService: CookieService) {
    this.checkoutForm = this.formBuilder.group({});
  }
  onKey(event) { this.request = event.target.value; }
  onClickMe() {
    if (this.request) {
      this.request = this.request.replace('-', '');
      var requestApi = this.api.concat(this.request)
      this.httpClient.get(requestApi, { responseType: 'text' }).subscribe(res => {
        this.error.nativeElement.style.display = "none";
        this.titre.nativeElement.disabled = true;
        this.auteur.nativeElement.disabled = true;
        this.description.nativeElement.disabled = true;
        this.genre.nativeElement.disabled = true;
        this.edition.nativeElement.disabled = true;
        this.anneeParution.nativeElement.disabled = true;
        this.langue.nativeElement.disabled = true;
        this.valider.nativeElement.disabled = true;
        var j = JSON.parse(res);
        if (j.items) {
          if (j.items[0].volumeInfo.imageLinks) {
            this.miniature.nativeElement.src = j.items[0].volumeInfo.imageLinks.thumbnail
          };
          if (j.items[0].volumeInfo.title) {
            this.titre.nativeElement.value = j.items[0].volumeInfo.title;
          }
          else {
            this.titre.nativeElement.disabled = false;
          }
          if (j.items[0].volumeInfo.authors) {
            this.auteur.nativeElement.value = j.items[0].volumeInfo.authors[0];
          } else { this.auteur.nativeElement.disabled = false; }
          if (j.items[0].volumeInfo.description) {
            this.description.nativeElement.value = j.items[0].volumeInfo.description;
          } else { this.description.nativeElement.disabled = false; }
          this.genre.nativeElement.disabled = false;
          if (j.items[0].volumeInfo.publisher) {
            this.edition.nativeElement.value = j.items[0].volumeInfo.publisher;
          } else { this.edition.nativeElement.disabled = false; }
          if (j.items[0].volumeInfo.publishedDate) {
            this.anneeParution.nativeElement.value = j.items[0].volumeInfo.publishedDate.toString().split('-')[0];
          } else { this.anneeParution.nativeElement.disabled = false; }
          if (j.items[0].volumeInfo.language) {
            this.langue.nativeElement.value = j.items[0].volumeInfo.language;
          } else { this.langue.nativeElement.disabled = false; }
          this.valider.nativeElement.disabled = false;
        } else {
          this.error.nativeElement.style.display = "";
          this.ancre.nativeElement.scrollIntoView();
          this.titre.nativeElement.disabled = false;
          this.auteur.nativeElement.disabled = false;
          this.description.nativeElement.disabled = false;
          this.genre.nativeElement.disabled = false;
          this.edition.nativeElement.disabled = false;
          this.anneeParution.nativeElement.disabled = false;
          this.langue.nativeElement.disabled = false;
          this.valider.nativeElement.disabled = false;
        }
      }
      )
    } else {
      console.log("error");
    }
  } ngOnInit(): void {
    if (this.cookieService.get('ID')) {
      console.log("Bite");
    } else {
      console.log("Alors on est pas co ?");
    };
  }
  onSubmit() {
    // Process checkout data here
    if (this.titre.nativeElement.value && this.titre.nativeElement.value && this.auteur.nativeElement.value && this.description.nativeElement.value && this.genre.nativeElement.value && this.edition.nativeElement.value && this.anneeParution.nativeElement.value && this.langue.nativeElement.value) {
      var arrayGenre = new Array<String>();
      for (var i = 0; i < 72; i++) {
        if (this.genre.nativeElement.querySelectorAll('.option-class')[i].selected) {
          arrayGenre.push(this.genre.nativeElement.querySelectorAll('.option-class')[i].innerText);
        };
      }
      console.log(arrayGenre);
      var livre = new Livre(this.request, this.titre.nativeElement.value, this.auteur.nativeElement.value, this.description.nativeElement.value, arrayGenre, this.edition.nativeElement.value, this.anneeParution.nativeElement.value, this.langue.nativeElement.value);
      console.log(livre);
    } else {
      console.log("Error please fill all fields");
    }

    //this.router.navigate(['/display']);
  }
}
