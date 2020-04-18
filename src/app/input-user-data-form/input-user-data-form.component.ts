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
      console.log(requestFinal);
      this.http.get(requestFinal, { responseType: 'text' }).subscribe(response => {
        if (response) {
          var i = JSON.parse(response);
          if (i.ID_personne) {
            this.cookieService.set('ID_USER', i.ID_personne);
            this.cookieService.set('justConnected','1');
            console.log(this.cookieService.get('ID_USER'));
            if (this.cookieService.get("FirstCo")) { 
              this.router.navigate(["/interets"])
            } else {
              this.router.navigate(["/display"]);
            }
          } else {
            console.log("Error account do not exist")
          }
        } else {
          console.log("Error ");
        }
      });
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
      console.log(client);
      var personne = {
        "Nom": client.nom,
        "Prenom": client.prenom,
        "Date_naissance": client.date,
        "Nationalite": client.nationalite
      };
      var verifmail = "http://localhost:3000/clients/verificationMAIL/" + this.courriel.nativeElement.value
      console.log(verifmail);
      this.http.get(verifmail, { responseType: 'text' }).subscribe(res => {
        var k = JSON.parse(res)
        console.log(k.resultat);
        if (k.resultat == false) {
          this.http.post('http://localhost:3000/personnes', personne, { responseType: 'text' })
            .subscribe(response => {
              var j = JSON.parse(response);
              console.log(j.id);
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
                console.log(i);
                Array.prototype.slice.call(document.getElementsByTagName('input')).forEach(elem => {
                  elem.value = "";
                })
                this.cookieService.set('FirstCo', 'True');
                this.newModal("Succès", "Vous vous êtes correctement enregistré ! Veuillez maintenant vous connecter", "J'ai compris")
              });
            });
        } else {
          console.log("Error. This email already exists");
        }
      })
    }
    else {
      console.log("ERROR");
    }
  }
}
