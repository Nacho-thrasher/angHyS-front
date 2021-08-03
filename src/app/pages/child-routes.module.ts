import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
import { Grafica1Component } from "./grafica1/grafica1.component";
import { ProgressComponent } from "./progress/progress.component";
import { AccountSettingsComponent } from "./account-settings/account-settings.component";
import { PromesasComponent } from "./promesas/promesas.component";
import { RxjsComponent } from "./rxjs/rxjs.component";
import { PerfilComponent } from "./perfil/perfil.component";
import { UsuariosComponent } from "./mantenimientos/usuarios/usuarios.component";
import { EmpresasComponent } from "./mantenimientos/empresas/empresas.component";
import { ExtintoresComponent } from "./mantenimientos/extintores/extintores.component";
import { ExtintorComponent } from "./mantenimientos/extintores/extintor.component";
import { BusquedasComponent } from "./busquedas/busquedas.component";
import { AdminGuard } from "../guard/admin.guard";

const childRoutes: Routes = [

  { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}},
  { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'}},
  { path: 'grafica1', component: Grafica1Component, data: {titulo: 'Grafica1'}},
  { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Configuracion'}},
  { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
  { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'}},
  { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil'}},

  //mantenimiento
  { path: 'empresas', component: EmpresasComponent, data: {titulo: 'Empresas'}},
  { path: 'extintores', component: ExtintoresComponent, data: {titulo: 'Extintores'}},
  { path: 'extintor/:id', component: ExtintorComponent, data: {titulo: 'Extintores'}},

  //busqueda tot
  { path: 'buscar/:termino', component: BusquedasComponent, data: {titulo: 'Busquedas'}},

  //rutas admin
  { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: {titulo: 'Usuarios'}}

]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(childRoutes)
  ],
  exports: [ RouterModule ]
})
export class ChildRoutesModule { }
