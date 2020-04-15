import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-interets',
  templateUrl: './interets.component.html',
  styleUrls: ['./interets.component.css']
})
export class InteretsComponent implements OnInit {
  private requete = "https://www.googleapis.com/books/v1/volumes?q=inauthor:";
  @ViewChild('auteur') auteur: ElementRef;
  public authors: Set<String>;
  public genres: Set<String>;
  genreForm;
  constructor(private http: HttpClient, private formBuilder: FormBuilder) {
    this.genreForm = this.formBuilder.group({});
    this.authors = new Set<String>();
    this.genres = new Set<String>();
  }
  removeAuthor(e: Event) {
    var event = e.currentTarget as HTMLButtonElement;
    this.authors.delete(event.parentElement.innerText.split("\n")[0]);
  }
  rechercheAuteur() {
    if (this.auteur.nativeElement.value) {
      var requestApi = this.requete.concat(this.auteur.nativeElement.value.replace(" ", "+"));
      this.http.get(requestApi, { responseType: 'text' }).subscribe(res => { var j = JSON.parse(res); this.authors.add(j.items[0].volumeInfo.authors[0].replace(". ", ".")) })
    }
  }
  updateCheckedOptions(e: Event) {
    if ((e.currentTarget as HTMLInputElement).checked) {
      this.genres.add((e.currentTarget as HTMLInputElement).parentElement.innerText);
    } else {
      this.genres.delete((e.currentTarget as HTMLInputElement).parentElement.innerText);
    }
    console.log(this.genres);
  }
  ngOnInit(): void {
  }

  verif() {
    if (this.genres.size >= 5 && this.authors.size >= 5) {
      console.log("OK");
    } else {
      console.log("Pas ok");
    }
  }

}
