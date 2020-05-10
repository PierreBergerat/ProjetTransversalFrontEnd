import { AdminComponent } from './admin/admin.component';
import { PersonnalWishlistComponent } from './personnal-wishlist/personnal-wishlist.component';
import { InteretsComponent } from './interets/interets.component';
import { RecommandationsComponent } from './recommandations/recommandations.component';
import { PagedaccueilComponent } from './pagedaccueil/pagedaccueil.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { DisplayUserDataComponent } from './display-user-data/display-user-data.component';
import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InputUserDataFormComponent } from './input-user-data-form/input-user-data-form.component';
import { WishlistComponent } from './wishlist/wishlist.component';


const routes: Routes = [
  {
    path: '', component: PagedaccueilComponent
  },
  {
    path: 'add', component: FrontpageComponent
  },
  {
    path: 'register', component: InputUserDataFormComponent
  },
  {
    path: 'display', component: DisplayUserDataComponent
  }, {
    path: 'wishlist', component: WishlistComponent
  }, {
    path: 'recommandations', component: RecommandationsComponent
  },
  {
    path: 'interets', component: InteretsComponent
  }, {
    path: 'wishlistpersonnal', component: PersonnalWishlistComponent
  }, {
    path: 'admin', component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
