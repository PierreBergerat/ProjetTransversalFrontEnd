import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { isNumber } from 'util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('showModal') showModal: ElementRef;
  @ViewChild('modalTitre') modalTitre: ElementRef;
  @ViewChild('modalContenu') modalContenu: ElementRef;
  @ViewChild('modalAccepter') modalAccepter: ElementRef;
  @ViewChild('modalRefuser') modalRefuser: ElementRef;

  public list: Array<any>;
  public livres: Array<any>;
  public map: Map<String, Boolean>;
  public count: Array<Number>
  constructor(private cookieService: CookieService, private router: Router, private httpClient: HttpClient) { this.list = new Array<any>(), this.map = new Map<String, Boolean>(), this.livres = new Array<any>() }


  ngOnInit(): void {
    if (!this.cookieService.get('IS_ADMIN')) {
      this.router.navigate(["/"])
    }
    this.httpClient.get("http://localhost:3000/clients", { responseType: 'text' }).subscribe(res => {
      this.list = JSON.parse(res);
      var supp = this.cookieService.get('US').split('|');
      if (supp) {
        for (let i = 0; i < supp.length; i++) {
          for (let j = 0; j < this.list.length; j++) {
            if (this.list[j].ID_personne == supp[i]) {
              this.list.splice(j, 1);
            }
          }
        }
      }
      this.sortBy(this.list, "Nom");
      this.httpClient.get("http://localhost:3000/livresNonVerifies", { responseType: 'text' }).subscribe(resultat => {
        this.livres = JSON.parse(resultat);
        this.sortBy(this.livres, "ID_Livre");
      })
    })
  }


  suppression(nom: String, e: Event, ID: String) {
    this.modalTitre.nativeElement.innerText = "Confirmation de suppression";
    this.modalContenu.nativeElement.innerText = "Êtes-vous certain de vouloir supprimer " + nom + ' ?';
    this.modalAccepter.nativeElement.innerText = "Oui, supprimer";
    this.modalAccepter.nativeElement.addEventListener("click", () => {
      (e.target as HTMLButtonElement).parentElement.parentElement.remove();
      this.cookieService.set("US", this.cookieService.get('US') + ID + '|')
      for (let index = 0; index < this.list.length; index++) {
        if (this.list[index].ID_personne == ID) {
          this.list.splice(index, 1);
        }
      }
    })
    this.modalRefuser.nativeElement.innerText = "Non, supprimer";
    this.trigger.nativeElement.click()
  }

  validation(titre: String, e: Event) {
    var requete = "http://localhost:3000/livres/verifier/" + (e.target as HTMLButtonElement).parentElement.parentElement.id + "/" + this.cookieService.get('ID_USER');
    this.httpClient.post(requete, { responseType: 'text' }).subscribe(res => {
      if (res) {
        this.modalTitre.nativeElement.innerText = "Vérification";
        this.modalContenu.nativeElement.innerText = "Livre vérifié avec succès !";
        this.modalAccepter.nativeElement.innerText = "";
        this.modalRefuser.nativeElement.innerText = "OK";
        this.trigger.nativeElement.click();
        (e.target as HTMLButtonElement).parentElement.parentElement.remove();
      }
    });
  }

  sortBy(array, key) {
    if (!this.map.has(key)) { this.map.set(key, true) };
    if (this.map.get(key)) {
      this.map.set(key, false);
      return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        if (!isNumber(x)) { x = x.toUpperCase(); y = y.toUpperCase() }
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    } else {
      this.map.set(key, true);
      return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        if ((!isNumber(x))) { x = x.toUpperCase(); y = y.toUpperCase() }
        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
      });
    }
  }


}
