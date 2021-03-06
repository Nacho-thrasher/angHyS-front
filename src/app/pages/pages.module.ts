import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//? pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProgressComponent } from './progress/progress.component';
import { PagesComponent } from './pages.component';
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './mantenimientos/usuarios/usuarios.component';
import { EmpresasComponent } from './mantenimientos/empresas/empresas.component';
import { ExtintorComponent } from './mantenimientos/extintores/extintor.component';
import { ExtintoresComponent } from './mantenimientos/extintores/extintores.component';
import { BusquedasComponent } from './busquedas/busquedas.component';
import { UsuarioComponent } from './mantenimientos/usuarios/usuario.component';
import { EmpresaComponent } from './mantenimientos/empresas/empresa.component';
import { ExtintoresExcelComponent } from './mantenimientos/extintores/extintores-excel.component';
import { ViewEmpresasComponent } from './editor-viste/view-empresas.component';
import { ViewExtintoresComponent } from './editor-viste/view-extintores/view-extintores.component';
import { ViewExtintorComponent } from './editor-viste/extintor-numSerie/view-extintor.component';
//? Modulo
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../app-routing.module';
import { PipesModule } from '../pipes/pipes.module';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { DataTablesModule } from 'angular-datatables';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgxDatatableModule, ColumnMode } from '@swimlane/ngx-datatable';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { ActualizarInspeccionComponent } from './inspeccion/actualizar-inspeccion.component';
import { NoEncontradoComponent } from './publicidad/no-encontrado.component';

//? datatables bt5

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
    ViewExtintoresComponent,
    ViewExtintorComponent,
    NosotrosComponent,
    ActualizarInspeccionComponent,
    NoEncontradoComponent
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
    PipesModule,
    DataTablesModule,
    NgxQRCodeModule,
    NgxSkeletonLoaderModule,
    NgxDatatableModule,
    NgxUiLoaderModule
  ]

})
export class PagesModule { }
