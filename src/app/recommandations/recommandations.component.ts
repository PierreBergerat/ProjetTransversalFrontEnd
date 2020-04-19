import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recommandations',
  templateUrl: './recommandations.component.html',
  styleUrls: ['./recommandations.component.css']
})
export class RecommandationsComponent implements OnInit {
  public j: any[];
  public i: any[];
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('showModal') showModal: ElementRef;
  @ViewChild('modalTitre') modalTitre: ElementRef;
  @ViewChild('modalContenu') modalContenu: ElementRef;
  @ViewChild('modalFermer') modalFermer: ElementRef;
  constructor(private router: Router, private httpClient: HttpClient, private cookieService: CookieService) {
    this.j = new Array<any>();
    this.i = new Array<any>();
  }

  ngOnInit(): void {
    var requeteBoth = "http://localhost:3000/livres/recommandations/listeBOTH/" + this.cookieService.get('ID_USER')
    var requeteAuteur = "http://localhost:3000/livres/recommandations/listeAUTEURS/" + this.cookieService.get('ID_USER')
    var requeteGenre = "http://localhost:3000/livres/recommandations/listeGENRES/" + this.cookieService.get('ID_USER')
    this.httpClient.get(requeteBoth).subscribe(resBoth => {
      Array.prototype.slice.call(resBoth).forEach(element => {
        this.j.push(element)
      });
      this.httpClient.get(requeteAuteur).subscribe(resAuteur => {
        Array.prototype.slice.call(resAuteur).forEach(element => {
          this.j.push(element)
        });
        this.httpClient.get(requeteGenre).subscribe(resGenre => {
          Array.prototype.slice.call(resGenre).forEach(element => {
            this.j.push(element)
            this.verifCredit()
          });
        })
      })
    })
    //requeteBoth
    //requeteAuteur
    //requeteGenre
  }

  newModal(titre: String, contenu: String, fermer: String) {
    this.modalTitre.nativeElement.innerText = titre;
    this.modalContenu.nativeElement.innerText = contenu;
    this.modalFermer.nativeElement.innerText = fermer;
    this.trigger.nativeElement.click()
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
        console.log("assez de crédit")
      }
    })
  }
  takeLivre(e: Event) {

    var ISBN = (e.currentTarget as HTMLButtonElement).parentElement.parentElement.parentElement.innerHTML.split("ISBN : ")[1].split('<')[0];
    console.log(ISBN);
    (e.currentTarget as HTMLButtonElement).remove();
    for (var i = 0; i < this.j.length; i++) {
      if (this.j[i].ISBN == ISBN) {
        var ID_LIVRE = this.j[i].ID_Livre;
        var requetePrendreLivre = "http://localhost:3000/livres/prendre/" + ID_LIVRE + '/' + this.cookieService.get('ID_USER')
        this.httpClient.post(requetePrendreLivre, "", { responseType: 'text' }).subscribe(res => {
          var retirerCredit = "http://localhost:3000/credits/enlever/" + this.cookieService.get('ID_USER');
          this.httpClient.post(retirerCredit, "", { responseType: 'text' }).subscribe(r => {
            this.verifCredit();
            console.log(r)
          })
        })
      }
    }
  }
}