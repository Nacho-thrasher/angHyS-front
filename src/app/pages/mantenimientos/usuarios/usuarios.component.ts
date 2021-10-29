import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

declare const $: any;
declare const jQuery: any;
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
  public usuarios!: Usuario[];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;
  viewImageUser: boolean = false;
  //? datatable ngx
  rows:any = [];
  filteredData:any = [];
  columnsWithSearch : string[] = [];
  temp:any = [];
  cols:any = [];
  expanded: any = {};
  loadingIndicator = true;
  reorderable = true;
  @ViewChild('editTmpl',{static: true}) editTmpl?: TemplateRef<any>;
  @ViewChild('hdrTpl',{static: true}) hdrTpl?: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild(DatatableComponent) tables?: DatatableComponent;
  //SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  //?vars para ocultar
  public nineteenNine:boolean = false;
  public eightyFive:boolean = false;
  public seventiTen:boolean = false;
  public sixtinThree:boolean = false;
  public thirtyThree:boolean = false;
  public fivetwentyFive:boolean = false;
  public fourteenFiveteenfive:boolean = false;
  public fourteenFour:boolean = false;
  public mobileTable:boolean = false;


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
      pagingType: 'simple_numbers',
      responsive: true,
      info: false,
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' },
      columnDefs: [
        { orderable: false, targets: 1 },
        { orderable: false, targets: 2 }
      ]
    };

    this.tableMobile();
    this.FuntionResize();
    //* esto sirveee
    this.cargarUsuarios();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(400)
    ).subscribe(img => {
      //setTimeout(()=> this.cargarUsuarios(), 400);
      this.cargarUsuarios()
    });
  }
  //todo funcion
  cargarUsuarios(){
    this.cargando = true;
    this.usuarioService.cargarAllUsuarios()
    .subscribe( usuario =>{
      this.usuarios = usuario;
      this.cargando = false;
      setTimeout(() => {
        this.temp = [...usuario];
        this.rows = usuario;
        this.filteredData = [...usuario];
        this.columnsWithSearch = Object.keys(this.rows[0]);
        this.loadingIndicator = false;
      },200)
    })

  }

  tableMobile(){
    if (screen.width <= 400) {
      this.mobileTable = true;
    }
    else{
      this.mobileTable = false;
    }
  }

  updateFilter(event:any) {
    // get the value of the key pressed and make it lowercase
    let filter = event.target.value.toLowerCase();
    // assign filtered matches to the active datatable
    this.rows = this.filteredData.filter( (item:any) => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]];
        // if no filter OR colvalue is NOT null AND contains the given filter
        if(!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
      return;
    });
    // TODO - whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  FuntionResize() {
    $(window).resize(() => {
      var widthBrowser = $(window).width();
      if (widthBrowser <= 990) {
        this.nineteenNine = true;
      }else{
        this.nineteenNine = false;
      }
      if (widthBrowser <= 850) {
        this.eightyFive = true;
      }else{
        this.eightyFive = false;
      }
      if (widthBrowser <= 710) {
        this.seventiTen = true;
      }else{
        this.seventiTen = false;
      }
      if (widthBrowser <= 630) {
        this.sixtinThree = true;
      }else{
        this.sixtinThree = false;
      }
      if (widthBrowser <= 525) {
        this.fivetwentyFive = true;
      }else{
        this.fivetwentyFive = false;
      }
      if (widthBrowser <= 455) {
        this.fourteenFiveteenfive = true;
      }else{
        this.fourteenFiveteenfive = false;
      }
      if (widthBrowser <= 445) {
        this.fourteenFour = true;
      }else{
        this.fourteenFour = false;
      }
      if (widthBrowser <= 361) {
        this.thirtyThree = true;
      }else{
        this.thirtyThree = false;
      }
   });
  }

  toggleExpandRow(row:any) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event:any) {
    //console.log('Detail Toggled', event);
  }

  loaded() {
    this.viewImageUser = true;
  }

  transformImg(img:string):string {
    //console.log(this.usuario.img)
    const myArr = img.split("/");
    let imagen = '';
    for (let i = 0; i < myArr.length; i++) {
      if (i + 1 === myArr.length) {
        imagen = imagen + myArr[i]
      }
      else {
        if (myArr[i] === 'upload') {
          imagen = imagen + myArr[i] + '/c_thumb,h_200,w_200/'
        }else {
          imagen = imagen + myArr[i] + '/'
        }
      }
    }
   return imagen;
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
  eliminarUsuarios(usuario: Usuario){

    if (usuario.uid === this.usuarioService.uid) {
      Swal.fire('error', 'no puede borrarse a si mismo', 'error');
    }
    else{
      Swal.fire({
        title: 'Estas seguro?',
        text: `Esta a punto de borrar a ${usuario.nombre}`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Si, Borrar!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.usuarioService.eliminarUsuarios(usuario).
          subscribe(resp =>{
            //console.log(resp)
          })
          Swal.fire(
            'Borrado!',
            `El usuario ${usuario.nombre} fue eliminado.`,
            'success'
          ),
          setTimeout(() => {
            this.cargarUsuarios()
        }, 400);
        }
      })
    }
    //console.log(usuario)
  }
  //* cambio de rol
  cambiarRole(usuario: Usuario){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timerProgressBar: true,
      //timer: 3000,
    })
    Toast.fire({
      icon: 'success',
      title: 'Role Cambiado',
      width: 270,
      //padding: '3em',
    })
    this.usuarioService.guardarUsuario(usuario)
    .subscribe(resp =>{
      //console.log(resp)
      Toast.close();
    })
  }
  //* abrir modal
  abrirModal(usuario: Usuario){
    //console.log(usuario)
    this.modalImgService.abrirModal('usuarios', usuario.uid , usuario.img);
  }
}
