import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styles: [
  ]
})

export class EmpresasComponent implements OnInit, OnDestroy {

  //public dtOptions: DataTables.Settings = {};
  public empresas?: Empresa[];
  public cargando?: boolean = true;
  public imgSubs!: Subscription;
  viewImageExtintor:boolean = false;
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
  public mobileTable:boolean = false;
  //?vars para ocultar
  public nineteenNine:boolean = false;
  public eightyFive:boolean = false;
  public seventiTen:boolean = false;
  public sixtinThree:boolean = false;
  public thirtyThree:boolean = false;
  public fivetwentyFive:boolean = false;
  public fourteenFiveteenfive:boolean = false;
  public fourteenFour:boolean = false;

  constructor(private empresaService: EmpresaService,
            private modalImgService: ModalImgService,
            private busquedasService: BusquedasService) { }

  //destroy
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  //oninit
  ngOnInit(): void {
    //datatables options
    // this.dtOptions = {
    //   pagingType: 'simple_numbers',
    //   responsive: true,
    //   info: false,
    //   language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' },
    //   columnDefs: [
    //     { orderable: false, targets: 1 },
    //     { orderable: false, targets: 2 }
    //   ]
    // };
    this.tableMobile();
    this.FuntionResize();
    //cargas
    this.cargarEmpresas();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(400)
    ).subscribe(img => {
      this.cargarEmpresas()
    });
    //

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
  tableMobile(){
    if (screen.width <= 400) {
      this.mobileTable = true;
    }
    else{
      this.mobileTable = false;
    }
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
  buscar(termino: string):any{
    if (termino.length === 0) {
      return this.cargarEmpresas();
    }
    //console.log(termino);
    this.busquedasService.buscar('empresas', termino)
    .subscribe( (empresas: any) => {
      //console.log(resp);
      this.empresas = empresas;
    })

  }
  //funcion
  cargarEmpresas(){
    //preload
    this.cargando = true;
    //funcion
    this.empresaService.cargarEmpresas()
    .subscribe(empresas=>{
      this.cargando = false;
      this.empresas = empresas;
      setTimeout(() => {
        this.temp = [...empresas];
        this.rows = empresas;
        this.filteredData = [...empresas];
        this.columnsWithSearch = Object.keys(this.rows[0]);
        this.loadingIndicator = false;
      },200)
    })
  }
  //delete
  eliminarEmpresa(empresa: Empresa){

    Swal.fire({
      title: 'Estas seguro?',
      text: `Se borrara Empresa: ${empresa.nombre}, estas seguro?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.empresaService.borrarEmpresa(empresa._id!)
        .subscribe(resp => {
        })
        Swal.fire(
          'Borrado!',
          `Extintor: ${empresa.nombre} fue eliminado.`,
          'success'
          ),
          setTimeout(() => {
            this.cargarEmpresas();
        }, 200);

      }
    })

  }
  toggleExpandRow(row:any) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event:any) {
    //console.log('Detail Toggled', event);
  }
  //modal cambiarImagen
  abrirModal(empresa:Empresa) {
    //console.log(empresa)
    this.modalImgService.abrirModal('empresas', empresa._id , empresa.img);
  }

}
