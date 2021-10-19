import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Extintor } from 'src/app/models/extintor.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ExtintorService } from 'src/app/services/extintor.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-extintores',
  templateUrl: './extintores.component.html',
  styles: [
  ],
  styleUrls:['./extintor.css']
})
export class ExtintoresComponent implements OnInit, OnDestroy {

  public dtOptions: DataTables.Settings = {};
  public extintores: Extintor[] = [];
  public cargando: boolean = true;
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

  constructor(private extintorService: ExtintorService,
            private modalImgService: ModalImgService,
            private busquedasService: BusquedasService,
            private empresaService: EmpresaService) { }
  //destroy
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  //oninit
  ngOnInit(): void {
    //size
    this.tableMobile();
    this.FuntionResize();
    this.datatables();
    this.cargarExtintores();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(400)
    ).subscribe(img => {
      this.cargarExtintores()
    });
    //cols
    this.cols = [
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'numeroSerie'
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'marca'
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'img'
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'agenteExtintor'
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'capacidad'
      },
      {
        cellTemplate: this.editTmpl,
        headerTemplate: this.hdrTpl,
        name: 'empresa'
      }
    ]
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

  loaded() {
      this.viewImageExtintor = true;
  }

  toggleExpandRow(row:any) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }

  onDetailToggle(event:any) {
    //console.log('Detail Toggled', event);
  }

  datatables(){
    this.dtOptions = {
      responsive: true,
      deferRender: true,
      pagingType: 'simple_numbers',
      info: false,
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' },
      columnDefs: [
        { orderable: false, targets: 1 },
        { orderable: false, targets: 2 }
      ]
    };
  }
  //funcion
  cargarExtintores(){
    //datatable options
    this.cargando = true;
    this.extintorService.cargarExtintores()
    .subscribe(extintor => {
      this.cargando = false;
      this.extintores = extintor;
      setTimeout(() => {
        this.temp = [...extintor];
        this.rows = extintor;
        this.filteredData = [...extintor];
        this.columnsWithSearch = Object.keys(this.rows[0]);
        this.loadingIndicator = false;
      },200)
    })
  }
  //abrirModal
  // abrirModal(extintor: Extintor){
  //   console.log(extintor)
  //   this.modalImgService.abrirModal('extintores', extintor._id , extintor.img);
  // }
  abrirModal(id: string, img:string){
    //console.log(id, img)
    this.modalImgService.abrirModal('extintores', id , img);
  }
  buscar(termino: string):any{
    if (termino.length === 0) {
      return this.cargarExtintores();
    }
    //console.log(termino);
    this.busquedasService.buscar('extintores', termino)
    .subscribe( (extintores: any) => {
      //console.log(resp);
      this.extintores = extintores;
      //console.log(extintores);
    })
  }
  //delete
  borrarExtintor(extintor:Extintor){
    //console.log(usuario)
    Swal.fire({
      title: 'Estas seguro?',
      text: `Se borrara Extintor: ${extintor.numeroSerie} - Marca: ${extintor.marca}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.extintorService.borrarExtintor(extintor._id!)
        .subscribe(resp =>{
          //todo
        })
        let numberExtintor: number = +extintor.empresa.nroExtintores!
        let resta:number = numberExtintor - 1
        const data = {
          nombre: extintor.empresa.nombre,
          nroExtintores: resta.toString(),
          _id: extintor.empresa._id
        }
        this.empresaService.actualizarNroExtEmpresa(data)
        .subscribe(resp =>{
          Swal.fire(
            'Borrado!',
            `Extintor: ${extintor.numeroSerie} Marca: ${extintor.marca} fue eliminado.`,
            'success'
          ),
          setTimeout(() => {
            this.cargarExtintores()
          }, 200);
        })
      }
    })
  }

}


