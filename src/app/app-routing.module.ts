import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
// Modulos
import { PagesRoutingModule } from './pages/pages.routing';
import { AuthRoutingModule } from './auth/auth.routing';

import { NoPageFoundComponent } from './no-page-found/no-page-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  { path: '**', component: NoPageFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes),
    PagesRoutingModule, // dashbord, grafica1, progress
    AuthRoutingModule // login, register
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
