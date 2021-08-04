import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public imgSubs!: Subscription;
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;



  constructor(private usuarioService: UsuarioService,
            private busquedasService: BusquedasService,
            private modalImgService: ModalImgService
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {

    this.cargarUsuarios();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(200)
    ).subscribe(img => {
      this.cargarUsuarios()
    });
  }

  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe( ({total, usuarios}) =>{
      //console.log(resp);
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      this.cargando = false;
    })
  }

  cambiarPagina(valor:number){
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    }
    else if(this.desde >= this.totalUsuarios){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string):any{
    if (termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    //console.log(termino);
    this.busquedasService.buscar('usuarios', termino)
    .subscribe( (usuarios: any) => {
      //console.log(resp);
      this.usuarios = usuarios;
    })

  }

  eliminarUsuarios(usuario: Usuario):any{

    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('error', 'no puede borrarse a si mismo', 'error');
    }
    //console.log(usuario)
    Swal.fire({
      title: 'Estas seguro?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuarios(usuario).pipe(
          delay(200)
        ).subscribe(resp =>{
          this.cargarUsuarios(),
          Swal.fire(
            'Borrado!',
            `El usuario ${usuario.nombre} fue eliminado.`,
            'success'
          )
        })
      }
    })
  }

  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
    .subscribe(resp =>{
      console.log(resp)
    })
  }

  abrirModal(usuario: Usuario){
    console.log(usuario)
    this.modalImgService.abrirModal('usuarios', usuario.uid , usuario.img);
  }
}
