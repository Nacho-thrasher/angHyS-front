import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from "./dashboard/dashboard.component";
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
import { UsuarioComponent } from './mantenimientos/usuarios/usuario.component';
import { EmpresaComponent } from './mantenimientos/empresas/empresa.component';
import { ExtintoresExcelComponent } from './mantenimientos/extintores/extintores-excel.component';
import { ViewEmpresasComponent } from './editor-viste/view-empresas.component';
import { ViewExtintoresComponent } from './editor-viste/view-extintores/view-extintores.component';

const childRoutes: Routes = [

  { path: '', component: DashboardComponent, data: {titulo: 'Dashboard'}},
  { path: 'progress', component: ProgressComponent, data: {titulo: 'Progress'}},
  { path: 'account-settings', component: AccountSettingsComponent, data: {titulo: 'Configuracion'}},
  { path: 'promesas', component: PromesasComponent, data: {titulo: 'Promesas'}},
  { path: 'rxjs', component: RxjsComponent, data: {titulo: 'Rxjs'}},
  { path: 'perfil', component: PerfilComponent, data: {titulo: 'Perfil'}},

  //mantenimiento
  { path: 'empresas', component: EmpresasComponent, data: {titulo: 'Empresas'}},
  { path: 'empresa/:id', component: EmpresaComponent, data: {titulo: 'Empresa'}},

  { path: 'extintores', component: ExtintoresComponent, data: {titulo: 'Extintores'}},
  { path: 'extintor/:id', component: ExtintorComponent, data: {titulo: 'Extintor'}},
  { path: 'extintores_excel', component: ExtintoresExcelComponent, data: {titulo: 'Extintores-Excel'}},

  //rutas admin
  { path: 'usuarios', canActivate: [AdminGuard], component: UsuariosComponent, data: {titulo: 'Usuarios'}},
  { path: 'usuario/:id', component: UsuarioComponent, data: {titulo: 'Usuario'}},

  { path: 'vista-empresas/:id', component: ViewExtintoresComponent, data: {titulo: 'Extintores'}},

  //busqueda tot
  { path: 'buscar/:termino', component: BusquedasComponent, data: {titulo: 'Busquedas'}},

  //principal any users
  { path: 'vista-empresas', component: ViewEmpresasComponent, data: {titulo: 'Empresas'}}

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
