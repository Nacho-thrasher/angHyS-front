import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from "../../models/usuario.model";
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalImgService } from '../../services/modal-img.service';


declare var $: any;
declare var Jquery: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ],
  styleUrls: [ './sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  menuItems!: any[];
  public usuario!: Usuario;
  public imgSubs!: Subscription;

  constructor(public sidebarService: SidebarService,
    private usuarioService: UsuarioService,
    private modalImgService: ModalImgService) {

    //this.menuItems = sidebarService.menu;
    //this.usuario = usuarioService.usuario;
  }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUser()
    this.imgSubs = this.usuarioService.nuevaImagen
    .pipe(
      delay(300)
    ).subscribe(img => {
      this.cargarUser();
    });

  }
  cargarUser(){
    this.usuario = this.usuarioService.usuario;
    //console.log(this.usuario.img);
  }
  cerrarSesion(){
    this.usuarioService.logout();
  }

}
