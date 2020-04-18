import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-personnal-wishlist',
  templateUrl: './personnal-wishlist.component.html',
  styleUrls: ['./personnal-wishlist.component.css']
})
export class PersonnalWishlistComponent implements OnInit {
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('showModal') showModal: ElementRef;
  @ViewChild('modalTitre') modalTitre: ElementRef;
  @ViewChild('modalContenu') modalContenu: ElementRef;
  @ViewChild('modalFermer') modalFermer: ElementRef;

  public j: Array<any>;
  constructor(private cookieService: CookieService, private router: Router, private httpClient: HttpClient) { this.j = new Array<any>() }



  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getInterets()
  }

  newModal(titre: String, contenu: String, fermer: String) {
    this.modalTitre.nativeElement.innerText = titre;
    this.modalContenu.nativeElement.innerText = contenu;
    this.modalFermer.nativeElement.innerText = fermer;
    this.trigger.nativeElement.click();
  }

  getInterets() {
    var i = 0;
    var requete = "http://localhost:3000/livres/interetsPERSONNE/" + this.cookieService.get('ID_USER');
    this.httpClient.get(requete, { responseType: 'text' }).subscribe(res => {
      Array.prototype.slice.call(JSON.parse(res)).forEach(elem => {
        var apiRequest = "https://www.googleapis.com/books/v1/volumes?q=isbn%3D" + elem.ISBN_livre
        this.httpClient.get(apiRequest, { responseType: 'text' }).subscribe(resultats => {
          if (JSON.parse(resultats).items) {
            this.j[i] = JSON.parse(resultats).items[0]
            i++;
          } else { console.log("probleme de get") }
        })
      })
      console.log(res)
    if(res == "[]"){
      this.newModal(":(","Vous n'avez pas encore de livres dans votre liste de souhaits. Cependant, vous pouvez en ajouter dans la page \"Liste de souhaits\" En entrant un ISBN ou un nom","J'ai compris")
    }})
  }


  delete(e: Event) {
    var destroyRequest = "http://localhost:3000/livres/interets/" + (e.currentTarget as HTMLButtonElement).parentElement.parentElement.parentElement.innerHTML.split("ISBN : ")[1].split("<")[0] + '/' + this.cookieService.get('ID_USER')
    this.httpClient.delete(destroyRequest).subscribe(res => {
      console.log(res)
    });
    (e.currentTarget as HTMLButtonElement).parentElement.parentElement.parentElement.remove()

  }
}
