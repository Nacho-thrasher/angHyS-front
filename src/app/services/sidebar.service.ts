import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  public menu:any[] = [];

  cargarMenu(){
    this.menu = JSON.parse(localStorage.getItem('menu')!) || [];

    //sacar al usuario
  }
  // menu: any[] = [
  //   {
  //     titulo: 'Principal',
  //     icono: 'mdi mdi-gauge',
  //     subMenu: [
  //       {
  //         titulo: 'Empresas',
  //         url: '/'
  //       },
  //       {
  //         titulo: 'Extintores',
  //         url: 'progress'
  //       },
  //       {
  //         titulo: 'Usuarios',
  //         url: 'grafica1'
  //       },
  //       {
  //         titulo: 'Promesas',
  //         url: 'promesas'
  //       },
  //       {
  //         titulo: 'Rxjs',
  //         url: 'rxjs'
  //       }
  //     ]
  //   },
  //   {
  //     titulo: 'Mantenimiento',
  //     icono: 'mdi mdi-folder-lock-open',
  //     subMenu: [
  //       {
  //         titulo: 'Planillas',
  //         url: '/'
  //       },
  //       {
  //         titulo: 'Imprtaciones',
  //         url: 'progress'
  //       },
  //       {
  //         titulo: 'Usuarios',
  //         url: 'usuarios'
  //       },
  //       {
  //         titulo: 'Empresas',
  //         url: 'empresas'
  //       },
  //       {
  //         titulo: 'Extintores',
  //         url: 'extintores'
  //       }
  //     ]
  //   }
  // ];

  constructor() { }
}
