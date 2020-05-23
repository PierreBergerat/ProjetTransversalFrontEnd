import { CookieService } from 'ngx-cookie-service';
import { Client } from './../Class/client';
import { Router } from '@angular/router';
import { Component, OnInit, NgModule } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'input-user-data-form',
  templateUrl: './input-user-data-form.component.html',
  styleUrls: ['./input-user-data-form.component.css']
})
export class InputUserDataFormComponent implements OnInit {
  private cookieValue: String;

  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('showModal') showModal: ElementRef;
  @ViewChild('modalTitre') modalTitre: ElementRef;
  @ViewChild('modalContenu') modalContenu: ElementRef;
  @ViewChild('modalFermer') modalFermer: ElementRef;

  @ViewChild('emailco') emailco: ElementRef;
  @ViewChild('passco') passco: ElementRef;
  @ViewChild('nom') nom: ElementRef;
  @ViewChild('prenom') prenom: ElementRef;
  @ViewChild('date') date: ElementRef;
  @ViewChild('adresse') adresse: ElementRef;
  @ViewChild('nationalite') nationalite: ElementRef;
  @ViewChild('num') num: ElementRef;
  @ViewChild('courriel') courriel: ElementRef;
  @ViewChild('motdepasse1') motdepasse1: ElementRef;
  @ViewChild('motdepasse2') motdepasse2: ElementRef;

  checkoutForm;
  connectForm;
  constructor(private cookieService: CookieService, private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private formBuilder2: FormBuilder) {
    this.checkoutForm = this.formBuilder.group({});
    this.connectForm = this.formBuilder2.group({});
  }

  newModal(titre: String, contenu: String, fermer: String) {
    this.modalTitre.nativeElement.innerText = titre;
    this.modalContenu.nativeElement.innerText = contenu;
    this.modalFermer.nativeElement.innerText = fermer;
    this.trigger.nativeElement.click();
  }

  ngOnInit(): void {
  }

  onConnectAttempt() {
    if (this.emailco.nativeElement.value && this.passco.nativeElement.value) {
      var request = "http://localhost:3000/clients/verification";
      var email = this.emailco.nativeElement.value;
      var motDePasse = this.passco.nativeElement.value;
      var requestFinal = request + '/' + email + '/' + motDePasse;
      this.http.get(requestFinal, { responseType: 'text' }).subscribe(response => {
        if (response) {
          var i = JSON.parse(response);
          if (i.ID_personne) {
            this.cookieService.set('ID_USER', i.ID_personne);
            this.cookieService.set('justConnected', '1');
            if (this.cookieService.get("FirstCo")) {
              this.router.navigate(["/interets"])
            } else {
              this.router.navigate(["/display"]);
            }
          } else {
            var requeteemploye = "http://localhost:3000/employes/verification/" + email + '/' + motDePasse;
            this.http.get(requeteemploye, { responseType: 'text' }).subscribe(res => {
              if (res) {
                if (JSON.parse(res).ID_personne) {
                  this.cookieService.set('IS_ADMIN', 'true');
                  this.cookieService.set('ID_USER', JSON.parse(res).ID_personne);
                  this.router.navigate(["/admin"])
                }
              } else {
                this.newModal("Erreur", "Erreur lors de la connexion avec la base de données. Veuillez réessayer.", "Fermer")
              }
            })
          }
        } else {
          var requeteemploye = "http://localhost:3000/employes/verification/" + email + '/' + motDePasse;
          this.http.get(requeteemploye, { responseType: 'text' }).subscribe(res => {
            if (res) {
              if (JSON.parse(res).ID_personne) {
                this.cookieService.set('IS_ADMIN', 'true');
                this.cookieService.set('ID_USER', JSON.parse(res).ID_personne);
                this.router.navigate(["/admin"])
              }
            } else {
              this.newModal("Erreur", "Erreur lors de la connexion avec la base de données. Veuillez réessayer.", "Fermer")
            }
          })
        }
      });
    } else {
      this.newModal("Erreur", "Veuillez compléter tous les champs", "Fermer")
    }
  }

  onSubmit() {
    if (
      this.nom.nativeElement.value &&
      this.prenom.nativeElement.value &&
      this.date.nativeElement.value &&
      this.adresse.nativeElement.value &&
      (this.nationalite.nativeElement.value != "Veuillez choisir un pays") &&
      this.num.nativeElement.value && this.courriel.nativeElement.value &&
      this.motdepasse1.nativeElement.value &&
      this.motdepasse2.nativeElement.value &&
      (this.motdepasse1.nativeElement.value == this.motdepasse2.nativeElement.value)) {
      var client = new Client(
        this.nom.nativeElement.value,
        this.prenom.nativeElement.value,
        this.date.nativeElement.value,
        this.adresse.nativeElement.value,
        this.nationalite.nativeElement.value,
        this.num.nativeElement.value,
        this.courriel.nativeElement.value,
        this.motdepasse1.nativeElement.value, 0)
      var personne = {
        "Nom": client.nom,
        "Prenom": client.prenom,
        "Date_naissance": client.date,
        "Nationalite": client.nationalite
      };
      var verifmail = "http://localhost:3000/clients/verificationMAIL/" + this.courriel.nativeElement.value
      this.http.get(verifmail, { responseType: 'text' }).subscribe(res => {
        var k = JSON.parse(res)
        if (k.resultat == false) {
          this.http.post('http://localhost:3000/personnes', personne, { responseType: 'text' })
            .subscribe(response => {
              var j = JSON.parse(response);
              var personne2 = {
                "ID_personne": j.id,
                "Numero_telephone": client.num,
                "Adresse_client": client.adresse,
                "Credits": client.credits,
                "Courriel": client.courriel,
                "Mot_de_passe": client.motdepasse
              };
              this.http.post('http://localhost:3000/clients', personne2, { responseType: 'text' }).subscribe(response => {
                var i = JSON.parse(response);
                Array.prototype.slice.call(document.getElementsByTagName('input')).forEach(elem => {
                  elem.value = "";
                })
                this.cookieService.set('FirstCo', 'True');
                this.newModal("Succès", "Vous vous êtes correctement enregistré ! Veuillez maintenant vous connecter", "J'ai compris")
              });
            });
        } else {
          this.newModal("Erreur", "Cet email existe déjà dans la base de données. Vous pouvez vous connecter normalement dans la section du haut ;)", "Fermer")
        }
      })
    }
    else {
      this.newModal("Erreur", "Veuillez compléter tous les champs correctement SVP.", "J'ai compris");
    }
  }
}
