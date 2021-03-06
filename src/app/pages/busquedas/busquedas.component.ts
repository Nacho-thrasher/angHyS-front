import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-busquedas',
  templateUrl: './busquedas.component.html',
  styles: [
  ]
})
export class BusquedasComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public empresas: Empresa[] = [];
  public extintores: Extintor[] = [];
  public cargando?: boolean = true;
  rows:any = [];
  temp:any = [];
  loadingIndicator = true;
  reorderable = true;
  @ViewChild('editTmpl',{static: true}) editTmpl?: TemplateRef<any>;
  @ViewChild('hdrTpl',{static: true}) hdrTpl?: TemplateRef<any>;
  @ViewChild('myTable') table: any;
  @ViewChild(DatatableComponent) tables?: DatatableComponent;
  //SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  public mobileTable:boolean = false;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private busquedasService: BusquedasService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.tableMobile();
    this.activatedRoute.params
    .subscribe( ({termino}) => {
      //console.log(termino);
      //this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
      this.busquedaGlobal(termino);
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
  busquedaGlobal(termino: string){
    this.cargando = true;
    this.busquedasService.busquedaGlobal(termino)
    .subscribe( (resp:any) => {
      if (this.usuarioService.token === '' || this.usuarioService.token === undefined) {
        this.empresas = resp.empresas;
        this.extintores = resp.extintores;
      }
      else{
        if (this.usuarioService.role === 'ADMIN_ROLE') {
          this.usuarios = resp.usuarios;
        }
        this.empresas = resp.empresas;
        this.extintores = resp.extintores;
        this.temp = [...this.extintores];
        this.rows = this.extintores;
        this.loadingIndicator = false;
        //console.log(resp);
      }
      this.cargando = false;
    })
  }
  toggleExpandRow(row:any) {
    //console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event:any) {
    //console.log('Detail Toggled', event);
  }
  navigate(nombre:any){
    let text1 = nombre.replace(/ /g, "_");
    this.router.navigateByUrl(`/dashboard/vista-empresas/${text1}`)
  }

  //? Si es usuario o admin
  isUFunc(){
    if (this.usuarioService.token === undefined || this.usuarioService.token === '') {
      return true;
    }
    if (this.usuarioService.role === 'USER_ROLE') {
      return true;
    }
    else{
      return false;
    }
  }
}
