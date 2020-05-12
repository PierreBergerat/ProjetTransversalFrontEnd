import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-interets',
  templateUrl: './interets.component.html',
  styleUrls: ['./interets.component.css']
})
export class InteretsComponent implements OnInit {
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('showModal') showModal: ElementRef;
  @ViewChild('modalTitre') modalTitre: ElementRef;
  @ViewChild('modalContenu') modalContenu: ElementRef;
  @ViewChild('modalFermer') modalFermer: ElementRef;
  private requete = "https://www.googleapis.com/books/v1/volumes?q=inauthor:";
  @ViewChild('auteur') auteur: ElementRef;
  @ViewChild('table') table: ElementRef;
  public authors: Set<String>;
  public genres: Set<String>;
  genreForm;
  constructor(private http: HttpClient, private formBuilder: FormBuilder, private cookieService: CookieService, private router: Router) {
    this.genreForm = this.formBuilder.group({});
    this.authors = new Set<String>();
    this.genres = new Set<String>();
  }


  newModal(titre: String, contenu: String, fermer: String) {
    this.modalTitre.nativeElement.innerText = titre;
    this.modalContenu.nativeElement.innerText = contenu;
    this.modalFermer.nativeElement.innerText = fermer;
    this.trigger.nativeElement.click();
  }

  ngAfterViewInit() {
    this.newModal("Choix des intérêts", "Vous allez maintenant pouvoir choisir vos intérêts pour des auteurs et genres particuliers. Veuillez en sélectionner au moins 5 de chaque catégorie", "J'ai compris")
  }

  ngAfterViewChecked() {
    Array.prototype.slice.call(document.getElementsByClassName('nav-link')).forEach(elem => {
      elem.style.display = "none"
    })
    Array.prototype.slice.call(document.getElementsByClassName('navbar-brand')).forEach(elem => {
      elem.href = "/interets"
    })
    if (this.cookieService.get("FirstCo")) {
      this.cookieService.delete("FirstCo")
    }
  }


  removeAuthor(e: Event) {
    var event = e.currentTarget as HTMLButtonElement;
    this.authors.delete(event.parentElement.innerText.split("\n")[0]);
  }
  rechercheAuteur() {
    if (this.auteur.nativeElement.value) {
      var requestApi = this.requete.concat(this.auteur.nativeElement.value.replace(" ", "+"));
      this.http.get(requestApi, { responseType: 'text' }).subscribe(res => {
        var j = JSON.parse(res);
        if (j.items) {
          this.authors.add(j.items[0].volumeInfo.authors[0].replace(". ", "."))
        }
      })
    }
  }
  updateCheckedOptions(e: Event) {
    if ((e.currentTarget as HTMLInputElement).checked) {
      this.genres.add((e.currentTarget as HTMLInputElement).parentElement.innerText);
    } else {
      this.genres.delete((e.currentTarget as HTMLInputElement).parentElement.innerText);
    }
    //console.log(this.genres);
  }
  ngOnInit(): void {
  }



  verif() {
    /* var s = document.getElementsByClassName('custom-control-label')
     for (var i = 0; i < s.length; i++) {
       var paquet = {
         "Genre": s[i].innerHTML
       }
       //console.log(paquet)
       this.http.post("http://localhost:3000/genres", paquet, { responseType: 'text' }).subscribe(res => {
         //console.log(res)
       })
     }*/
    if (this.genres.size >= 5 && this.authors.size >= 5) {
      //console.log("OK");
      //console.log(this.genres);
      //console.log(this.authors);
      this.authors.forEach(auteur => {
        var requeteAuteur = 'http://localhost:3000/verification/auteur/' + auteur;
        //console.log(requeteAuteur)
        this.http.get(requeteAuteur, { responseType: 'text' }).subscribe(response => {
          //console.log(response)
          var auteurvalue = JSON.parse(response)
          if (auteurvalue.ID_auteur) {
            var auteurID = auteurvalue.ID_auteur
            var requeteInteret = "http://localhost:3000/auteurs/interets/" + auteurID + '/' + this.cookieService.get('ID_USER')
            //console.log(requeteInteret)
            this.http.post(requeteInteret, "", { responseType: 'text' }).subscribe(rep => {
              //console.log(rep);
            })
            //AUTEUR EXISTE DEJA
          } else {
            //AJOUTER AUTEUR
            var postAuteur = { "Nom_complet": auteur }
            //console.log(postAuteur)
            this.http.post('http://localhost:3000/auteurs', postAuteur, { responseType: 'text' }).subscribe(rep => {
              var auteurID = JSON.parse(rep).id;
              //console.log(auteurID)
              var requeteInteret = "http://localhost:3000/auteurs/interets/" + auteurID + '/' + this.cookieService.get('ID_USER')
              //console.log(requeteInteret)
              this.http.post(requeteInteret, "", { responseType: 'text' }).subscribe(rep => {
                //console.log(rep);
              })
              //console.log("REPONSE FINALE")
              //console.log(r);
            })
          }
        })
      })
      this.genres.forEach(genre => {
        var request = 'http://localhost:3000/id/genres/' + genre
        this.http.get(request, { responseType: 'text' }).subscribe(id => {
          var genre_ID = JSON.parse(id).ID_genre;
          //console.log(genre_ID)
          var interetGenre = 'http://localhost:3000/genres/interets/' + genre_ID + '/' + this.cookieService.get('ID_USER');
          this.http.post(interetGenre, "", { responseType: 'text' }).subscribe(response => {
            //console.log(response);
          })
        })
        //requete interet auteur
        //requete interet genre
      })
      Array.prototype.slice.call(document.getElementsByClassName('nav-link')).forEach(elem => {
        elem.style.display = ""
      })
      Array.prototype.slice.call(document.getElementsByClassName('navbar-brand')).forEach(elem => {
        elem.href = "/"
      })
      this.router.navigate(["/display"])
    }
    else {
      this.newModal("Erreur", "Veuillez entrer au moins 5 valeurs pour chaque section (auteur et genre). Merci", "J'ai compris")
    }


  }
}