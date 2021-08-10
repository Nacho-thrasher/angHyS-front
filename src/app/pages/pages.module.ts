import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';


// Modulo
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { EmpresasComponent } from './mantenimientos/empresas/empresas.component';
import { PipesModule } from '../pipes/pipes.module';
import { ExtintoresComponent } from './mantenimientos/extintores/extintores.component';
import { ExtintorComponent } from './mantenimientos/extintores/extintor.component';
import { BusquedasComponent } from './busquedas/busquedas.component';
import { UsuarioComponent } from './mantenimientos/usuarios/usuario.component';
import { EmpresaComponent } from './mantenimientos/empresas/empresa.component';
import { ExtintoresExcelComponent } from './mantenimientos/extintores/extintores-excel.component';
import { ViewEmpresasComponent } from './editor-viste/view-empresas.component';
import { ViewExtintoresComponent } from './editor-viste/view-extintores/view-extintores.component';



@NgModule({
  declarations: [
    DashboardComponent,
    ProgressComponent,
    PagesComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent,
    PerfilComponent,
    UsuariosComponent,
    EmpresasComponent,
    ExtintoresComponent,
    ExtintorComponent,
    BusquedasComponent,
    UsuarioComponent,
    EmpresaComponent,
    ExtintoresExcelComponent,
    ViewEmpresasComponent,
    ViewExtintoresComponent
  ],
  exports:[
    DashboardComponent,
    ProgressComponent,
    PagesComponent,
    AccountSettingsComponent,
    PromesasComponent,
    RxjsComponent
  ],
  imports: [

    ReactiveFormsModule,
    CommonModule,
    SharedModule,
    AppRoutingModule,
    FormsModule,
    ComponentsModule,
    PipesModule
  ]

})

export class PagesModule { }
