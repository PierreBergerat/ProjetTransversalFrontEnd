import { CookieService } from 'ngx-cookie-service';
import { Livre } from './../Class/livre';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.css'],
})
export class FrontpageComponent implements OnInit {
  private livre_ID: String;

  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('showModal') showModal: ElementRef;
  @ViewChild('modalTitre') modalTitre: ElementRef;
  @ViewChild('modalContenu') modalContenu: ElementRef;
  @ViewChild('modalFermer') modalFermer: ElementRef;

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
  api = "https://www.googleapis.com/books/v1/volumes?q=isbn%3D";
  request = "";
  checkoutForm;
  constructor(private httpClient: HttpClient, private router: Router, private formBuilder: FormBuilder, private cookieService: CookieService) {
    this.checkoutForm = this.formBuilder.group({});
  }
  onKey(event) { this.request = event.target.value; }


  newModal(titre: String, contenu: String, fermer: String) {
    this.modalTitre.nativeElement.innerText = titre;
    this.modalContenu.nativeElement.innerText = contenu;
    this.modalFermer.nativeElement.innerText = fermer;
    this.trigger.nativeElement.click()
  }


  onClickMe() {
    if (this.request) {
      this.request = this.request.replace('-', '');
      var requestApi = this.api.concat(this.request)
      this.httpClient.get(requestApi, { responseType: 'text' }).subscribe(res => {
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
          this.newModal("ISBN INCONNU", "L'ISBN que vous avez entré n'est pas reconnu par nos services, veuillez s'il vous plait compléter les informations vous-même.", "J'ai compris")
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
      //console.log("error");
    }
  } ngOnInit(): void {
    if (this.cookieService.get('ID_USER')) {
      //console.log("Got an ID");
    } else {
      //console.log("Alors on est pas co ?");
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
      //console.log(arrayGenre);
      var livre = new Livre(this.request, this.titre.nativeElement.value, this.auteur.nativeElement.value, this.description.nativeElement.value, arrayGenre, this.edition.nativeElement.value, this.anneeParution.nativeElement.value, this.langue.nativeElement.value);
      //console.log(livre);
      var clientRequete = {
        "ID_Personne_Enregistre": Number(this.cookieService.get("ID_USER")),
        "ISBN": this.request,
        "Titre": this.titre.nativeElement.value,
        "Description": this.description.nativeElement.value,
        "Editeur": this.edition.nativeElement.value,
        "Annee_parution": this.anneeParution.nativeElement.value,
        "Langue": this.langue.nativeElement.value,
        "Verifie": 1
      }
      //console.log(clientRequete);
      this.httpClient.post('http://localhost:3000/livres', clientRequete, { responseType: 'text' }).subscribe(response => {
        var r = JSON.parse(response);
        this.livre_ID = r.id;
        arrayGenre.forEach(genre => {
          var request = 'http://localhost:3000/id/genres/' + genre
          this.httpClient.get(request, { responseType: 'text' }).subscribe(id => {
            var genre_ID = JSON.parse(id).ID_genre;
            //console.log(genre_ID);
            var requestGenreLivre = 'http://localhost:3000/genres/livres/' + genre_ID + '/' + this.livre_ID
            this.httpClient.post(requestGenreLivre, "", { responseType: 'text' }).subscribe(resultat => {
              var t = JSON.parse(resultat)
              //console.log(t)

            })
          })
        })
        var requeteAuteur = 'http://localhost:3000/verification/auteur/' + this.auteur.nativeElement.value;
        //console.log(requeteAuteur)
        this.httpClient.get(requeteAuteur, { responseType: 'text' }).subscribe(response => {
          var auteurvalue = JSON.parse(response)
          if (auteurvalue.ID_auteur) {
            var auteurID = auteurvalue.ID_auteur
            var requeteLivreAuteur = 'http://localhost:3000/auteurs/livres/' + auteurID + '/' + this.livre_ID
            this.httpClient.post(requeteLivreAuteur, "", { responseType: 'text' }).subscribe(r => {
              var creditUtilisateur = 'http://localhost:3000/credits/ajouter/' + this.cookieService.get("ID_USER")
              this.httpClient.post(creditUtilisateur, "", { responseType: 'text' }).subscribe(e => {
                this.newModal("Succès", "Votre livre a été inséré avec succès ! Merci !", "Fermer");
                Array.prototype.slice.call(document.getElementsByTagName('input')).forEach(elem => {
                  elem.value = "";
                })
                //console.log("REPONSE FINALE")
                //console.log(r);
              })
            })
          } else {
            var postAuteur = { "Nom_complet": this.auteur.nativeElement.value }
            //console.log(postAuteur)
            this.httpClient.post('http://localhost:3000/auteurs', postAuteur, { responseType: 'text' }).subscribe(rep => {
              var auteurID = JSON.parse(rep).id;
              var requeteLivreAuteur = 'http://localhost:3000/auteurs/livres/' + auteurID + '/' + this.livre_ID
              this.httpClient.post(requeteLivreAuteur, "", { responseType: 'text' }).subscribe(r => {
                //console.log("REPONSE FINALE")
                ////console.log(r);
                var creditUtilisateur = 'http://localhost:3000/credits/ajouter/' + this.cookieService.get("ID_USER")
                this.httpClient.post(creditUtilisateur, "", { responseType: 'text' }).subscribe(e => {
                  this.newModal("Succès", "Votre livre a été inséré avec succès ! Merci !", "Fermer");
                  Array.prototype.slice.call(document.getElementsByTagName('input')).forEach(elem => {
                    elem.value = "";
                  })
                  console.log(e);
                })
              })
            });
          }
        })
      })
    } else {
      this.newModal("Champs manquants", "Veuillez s'il vous plaît compléter tous les champs avant d'envoyer votre requête.", "J'ai compris")
      //console.log("Error please fill all fields");
    }
    this.router.navigate(['/add']);
  }
}
