import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Extintor } from 'src/app/models/extintor.model';
import { ExtintorService } from 'src/app/services/extintor.service';
import { EmpresaService } from '../../../services/empresa.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
declare const $: any;
declare const jQuery: any;
@Component({
  selector: 'app-view-extintores',
  templateUrl: './view-extintores.component.html',
  styles: [
  ],
  styleUrls: ['view-extintores.css']
})

export class ViewExtintoresComponent implements OnInit {

  public nomEmpr:String = '';
  public extintores: Extintor[] = [];
  public dtOptions: DataTables.Settings = {};
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
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private empresaService: EmpresaService)
  { }

  //todo oninit
  ngOnInit(): void {
    //?datatable options
    this.tableMobile();
    this.FuntionResize();
    this.dtOptions = {
      pagingType: 'numbers',
      responsive: true,
      info: false,
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' },
      columnDefs: [
        { orderable: false, targets: 1 }
      ]
    };
    //?carga
    this.activatedRoute.params.subscribe( ({id}) => {
      this.cargarExtintoresByEmpresa(id);
    })
  }

  loaded() {
    setTimeout(() => {
      this.viewImageExtintor = true;
    }
    , 400);
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
  toggleExpandRow(row:any) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event:any) {
    //console.log('Detail Toggled', event);
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

  //* function cargar
  cargarExtintoresByEmpresa(id: string){
    this.extintorService.cargarExtintoresByEmpresa(id)
    .subscribe( (resp:any) => {

      if (resp.msg === 'no existe empresa') {
        this.router.navigateByUrl(`/dashboard/vista-empresas`);
        return;
      }
      this.nomEmpr = resp.nom;
      this.extintores = resp.extintores;
      setTimeout(() => {
        this.temp = [...this.extintores];
        this.rows = this.extintores;
        this.filteredData = [...this.extintores];
        this.columnsWithSearch = Object.keys(this.rows[0]);
        this.loadingIndicator = false;
      },200)
    })
  }


}
