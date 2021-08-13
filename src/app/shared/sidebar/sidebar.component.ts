import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from "../../models/usuario.model";

declare var $: any;
declare var Jquery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  menuItems!: any[];
  public usuario!: Usuario;

  constructor(public sidebarService: SidebarService,
    private usuarioService: UsuarioService) {

      //this.menuItems = sidebarService.menu;
      this.usuario = usuarioService.usuario;

  }

  ngOnInit(): void {
  }

  cerrarSesion(){
    this.usuarioService.logout();
  }

}