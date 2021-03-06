import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// Modulos
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
// Components
import { AppComponent } from './app.component';
import { NoPageFoundComponent } from './no-page-found/no-page-found.component';

import { DataTablesModule } from 'angular-datatables';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
  NgxUiLoaderRouterModule,
  NgxUiLoaderHttpModule } from 'ngx-ui-loader';

  const ngxUiLoaderConfig: NgxUiLoaderConfig = {
    "bgsColor": "#f53e3e",
    "bgsOpacity": 0.8,
    "bgsPosition": "top-right",
    "bgsSize": 40,
    "bgsType": "ball-spin-fade-rotating",
    "blur": 4,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "#f53e3e",
    "fgsPosition": "center-center",
    "fgsSize": 60,
    "fgsType": "double-bounce",
    "gap": 25,
    "logoPosition": "center-center",
    "logoSize": 120,
    "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(40,40,40,0.6)",
    "pbColor": "#f53e3e",
    "pbDirection": "ltr",
    "pbThickness": 6,
    "hasProgressBar": true,
    "text": "HyS Matafuegos",
    "textColor": "#ffffff",
    "textPosition": "center-center",
    "maxTime": -1,
    "minTime": 300
  };

@NgModule({
  declarations: [
    AppComponent,
    NoPageFoundComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PagesModule,
    AuthModule,
    DataTablesModule,
    NgxDatatableModule,
    //NgxUiLoaderModule
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderRouterModule, // import this module for showing loader automatically when navigating between app routes
    NgxUiLoaderHttpModule
  ],
  exports:[
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

