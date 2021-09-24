import { Component, OnDestroy, OnInit } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from "../../models/usuario.model";
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ModalImgService } from '../../services/modal-img.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  public imgRadius!: string;
  public imagen:string = '';
  //?
  public ifActive!: boolean;

  constructor(public sidebarService: SidebarService,
    private usuarioService: UsuarioService,
    private modalImgService: ModalImgService,
    private router: Router,
    private activatedRouter: ActivatedRoute) {

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
    this.switchActive()
    this.usuario = this.usuarioService.usuario;
    if (this.usuario === undefined) {
    }
    else{
      this.transformImg(this.usuarioService.usuario.img!)
      this.imgSubs = this.usuarioService.nuevaImagen
      .pipe(
        delay(200)
      ).subscribe(img => {
        this.usuario = this.usuarioService.usuario;
        this.transformImg(this.usuarioService.usuario.img!);
      });
    }
  }

  transformImg(img:string):string{
    //console.log(this.usuario.img)
    const myArr = img.split("/");
    for (let i = 0; i < myArr.length; i++) {
      if (i + 1 === myArr.length) {
        this.imagen = this.imagen + myArr[i]
      }
      else {
        if (myArr[i] === 'upload') {
          this.imagen = this.imagen + myArr[i] + '/c_thumb,h_100,w_100/'
        }else {
          this.imagen = this.imagen + myArr[i] + '/'
        }
      }
    }
    return this.imagen;
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

  switchActive(){

    

  }

}
