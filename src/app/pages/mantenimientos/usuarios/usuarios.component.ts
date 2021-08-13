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

  public dtOptions: DataTables.Settings = {};
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
  //todo destroy
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  //todo oninit
  ngOnInit(): void {
    //datatable options
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' }
    };
    //cargas
    this.cargarUsuarios();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(200)
    ).subscribe(img => {
      this.cargarUsuarios()
    });
  }
  //todo funcion
  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarAllUsuarios()
    .subscribe( usuarios =>{
      //console.log(resp);
      //this.totalUsuarios = total;
      this.usuarios = usuarios;
      //this.usuariosTemp = usuarios;

      this.cargando = false;
    })
  }
  //? pagination manual
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
  //? busqueda manual
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
  //? delete arreglar
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
  //* cambio de rol
  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
    .subscribe(resp =>{
      console.log(resp)
    })
  }
  //* abrir modal
  abrirModal(usuario: Usuario){
    console.log(usuario)
    this.modalImgService.abrirModal('usuarios', usuario.uid , usuario.img);
  }
}