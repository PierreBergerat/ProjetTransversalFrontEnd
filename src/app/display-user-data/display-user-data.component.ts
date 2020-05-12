import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-display-user-data',
  templateUrl: './display-user-data.component.html',
  styleUrls: ['./display-user-data.component.css']
})
export class DisplayUserDataComponent implements OnInit {

  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('showModal') showModal: ElementRef;
  @ViewChild('modalTitre') modalTitre: ElementRef;
  @ViewChild('modalContenu') modalContenu: ElementRef;
  @ViewChild('modalFermer') modalFermer: ElementRef;

  public j: Array<String>;
  public m: Array<Array<String>>;
  public k: Array<String>;
  public p: Array<String>;
  public livresNotifs: Set<String>
  public livreDispoTitres: Array<String>
  public rest;
  public nomEtCredits;
  constructor(private router: Router, private httpClient: HttpClient, private cookieService: CookieService) {
    this.j = new Array<String>();
    this.m = new Array<Array<String>>();
    this.k = new Array<String>();
    this.p = new Array<String>();
    this.livresNotifs = new Set<String>();
    this.livreDispoTitres = new Array<String>()
  }

  newModal(titre: String, contenu: String, fermer: String) {
    this.modalTitre.nativeElement.innerText = titre;
    this.modalContenu.nativeElement.innerText = contenu;
    this.modalFermer.nativeElement.innerText = fermer;
    this.trigger.nativeElement.click()
  }
  ngOnInit() {
    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
          content.style.display = "none";
        } else {
          content.style.display = "block";
        }
      });
    }
  }
  ngAfterViewInit() {
    var c = 0;
    this.httpClient.get("http://localhost:3000/livres", { responseType: 'json' }).subscribe(res => {
      this.j = res as Array<String>;
      this.rest = res;
      for (var i = 0; i < this.j.length; i++) {
        this.getImage(res[i].ISBN, i)
        this.getGenre(res[i].ID_Livre, i)
        this.getAuteur(res[i].ID_Livre, i)
      }
      //console.log(this.j)
      if (this.cookieService.get('justConnected') == '1') {
        //console.log("TRUE")
        var requete = "http://localhost:3000/livres/interetsPERSONNE/" + this.cookieService.get('ID_USER');
        this.httpClient.get(requete, { responseType: 'text' }).subscribe(response => {
          //console.log(response)
          if (res == '[]') { //console.log("Pas de notifs")
          }
          Array.prototype.slice.call(JSON.parse(response)).forEach(elem => {
            //console.log("cc")
            var apiRequest = "http://localhost:3000/livres/disponible/" + elem.ISBN_livre
            this.httpClient.get(apiRequest, { responseType: 'text' }).subscribe(reponse => {
              if (JSON.parse(reponse)[0]) {
                this.livresNotifs.add(JSON.parse(reponse)[0].ID_livre)
              }
              c++;
              if (c == JSON.parse(response).length) {
                //console.log("Fin ?")
                this.livresNotifs.forEach(id => {
                  for (var i = 0; i < this.j.length; i++) {
                    if (res[i].ID_Livre == id) {
                      this.livreDispoTitres.push(res[i].Titre)
                    }
                  }
                })
                if (this.livresNotifs.size != 0) {
                  this.modalTitre.nativeElement.innerText = "Nouveaux livres disponibles parmi votre liste de souhaits !";
                  this.modalFermer.nativeElement.innerText = "J'ai compris !";
                  this.trigger.nativeElement.click()
                }
              }
            }
            )
          })
        })
        this.cookieService.delete('justConnected')
      }
      //console.log(this.k)
      this.verifCredit();
    })
    if (this.cookieService.get('ID_USER')) {
      var requestCredit = "http://localhost:3000/credits/verification/" + this.cookieService.get('ID_USER')
      this.httpClient.get(requestCredit, { responseType: 'text' }).subscribe(response => {
        this.httpClient.get("http://localhost:3000/clients", { responseType: 'text' }).subscribe(res => {
          for (var i = 0; i < JSON.parse(res).length; i++) {
            if (JSON.parse(res)[i].ID_personne == this.cookieService.get('ID_USER')) {
              this.nomEtCredits =JSON.parse(res)[i].Prenom + ' (' + JSON.parse(response)[0].Credits + ' CR)'
            }
          }
          document.getElementById('nomCredits').innerHTML = this.nomEtCredits;
        });
      })
    }
  }

  verifCredit() {
    var requestCredit = "http://localhost:3000/credits/verification/" + this.cookieService.get('ID_USER')
    this.httpClient.get(requestCredit, { responseType: 'text' }).subscribe(response => {
      var j = JSON.parse(response);
      if (j[0].Credits <= 0) {
        //console.log("true")
        Array.prototype.slice.call(document.getElementsByClassName('clickable')).forEach(elem => {
          elem.style.display = "none";
        })
      } else {
        Array.prototype.slice.call(document.getElementsByClassName('clickable')).forEach(elem => {
          elem.style.display = "";
        })
        //console.log("assez de crédit")
      }

    })
  }

  getImage(ISBN: String, index: number) {
    //console.log(ISBN)
    var r = "https://www.googleapis.com/books/v1/volumes?q=isbn%3D" + ISBN
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
      //console.log(reponse)
      var mgcstf = JSON.parse(reponse)
      this.p[index] = mgcstf;
    })
  }

  takeLivre(e: Event) {
    var ISBN = (e.currentTarget as HTMLButtonElement).parentElement.parentElement.parentElement.innerHTML.split("ISBN : ")[1].split('<')[0];
    (e.currentTarget as HTMLButtonElement).remove();
    for (var i = 0; i < this.j.length; i++) {
      if (this.rest[i].ISBN == ISBN) {
        var ID_LIVRE = this.rest[i].ID_Livre;
        var requetePrendreLivre = "http://localhost:3000/livres/prendre/" + ID_LIVRE + '/' + this.cookieService.get('ID_USER')
        this.httpClient.post(requetePrendreLivre, "", { responseType: 'text' }).subscribe(res => {
          var retirerCredit = "http://localhost:3000/credits/enlever/" + this.cookieService.get('ID_USER');
          this.httpClient.post(retirerCredit, "", { responseType: 'text' }).subscribe(r => {
            var retirerInteret = "http://localhost:3000/livres/interets/" + ISBN + '/' + this.cookieService.get('ID_USER');
            this.httpClient.delete(retirerInteret).subscribe(resultatdelete => {
              //console.log(resultatdelete)
            })
            this.verifCredit();
            //console.log(r)
          })
        })
      }
    }
  }

}
