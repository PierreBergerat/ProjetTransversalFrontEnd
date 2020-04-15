import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpInterceptor, HttpRequest, HttpHandler, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InputUserDataFormComponent } from './input-user-data-form/input-user-data-form.component';
import { DisplayUserDataComponent } from './display-user-data/display-user-data.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { PagedaccueilComponent } from './pagedaccueil/pagedaccueil.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { RecommandationsComponent } from './recommandations/recommandations.component';
import { InteretsComponent } from './interets/interets.component';

@NgModule({
  declarations: [
    AppComponent,
    InputUserDataFormComponent,
    DisplayUserDataComponent,
    FrontpageComponent,
    PagedaccueilComponent,
    WishlistComponent,
    RecommandationsComponent,
    InteretsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
