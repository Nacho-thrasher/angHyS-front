import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from "../../models/usuario.model";
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalImgService } from '../../services/modal-img.service';
import { Router } from '@angular/router';


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
    private modalImgService: ModalImgService,
    private router: Router,) {

    //this.menuItems = sidebarService.menu;
    //this.usuario = usuarioService.usuario;
  }
  ngOnDestroy(): void {
    if (this.usuario === undefined || this.usuario === null) {
    }
    else{
      this.imgSubs.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
    //console.log(this.usuario);
    if (this.usuario === undefined) {

    }
    else{
      this.imgSubs = this.usuarioService.nuevaImagen
      .pipe(
        delay(300)
      ).subscribe(img => {
        this.usuario = this.usuarioService.usuario;
      });
    }
  }
  usuarioLogeado(){
    if (this.usuario === undefined) {
      return false;
    }
    else{
      return true;
    }
  }

  cerrarSesion(){
    this.router.navigateByUrl('/login')
    this.usuarioService.logout();
  }

}
