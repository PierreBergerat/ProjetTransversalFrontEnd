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
  constructor(private formBuilder: FormBuilder, private router: Router, private http: HttpClient) {
    this.checkoutForm = this.formBuilder.group({});
  }
  ngOnInit(): void {

  }
  onConnectAttempt() {
    if (this.emailco.nativeElement.value && this.passco.nativeElement.value) {
      //TODO
      this.http.get("localhost:3000", { responseType: 'text' }).subscribe(res => { });
    }
  }
  onSubmit() {
    if (this.nom.nativeElement.value && this.prenom.nativeElement.value && this.date.nativeElement.value && this.adresse.nativeElement.value && (this.nationalite.nativeElement.value != "Veuillez choisir un pays") && this.num.nativeElement.value && this.courriel.nativeElement.value && this.motdepasse1.nativeElement.value && this.motdepasse2.nativeElement.value) {
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
    }
    else {
      console.log("ERROR");
    }
  }
}
