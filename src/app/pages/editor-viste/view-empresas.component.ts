import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ExtintorService } from 'src/app/services/extintor.service';

@Component({
  selector: 'app-view-empresas',
  templateUrl: './view-empresas.component.html',
  styles: [
  ],
  styleUrls: [
    './view-empresas.component.css'
  ]
})
export class ViewEmpresasComponent implements OnInit {

  constructor(private empresaService: EmpresaService,
              private router: Router,
              private extintorService: ExtintorService) { }

  public empresas?: Empresa[];
  public cargando?: boolean = true;
  public extintores: Extintor[] = [];
  public cantidad!:number;

  ngOnInit(): void {
    this.cargarEmpresas()
  }

  cargarEmpresas(){
    this.cargando = true;

    this.empresaService.cargarEmpresas()
    .subscribe(empresas=>{
      this.cargando = false;
      this.empresas = empresas;
      this.cantidad = empresas.length;
    })
  }
  navigate(nombre:any){

    let text1 = nombre.replace(/ /g, "_");
    this.router.navigateByUrl(`/dashboard/vista-empresas/${text1}`)

  }

  //chuche para saber cuantos extintores tengo en empresa
  cargarExtintoresByEmpresa(id: string){
    this.extintorService.cargarExtintoresByEmpresa(id)
    .subscribe( (resp:any) => {
      //console.log(resp);
      this.extintores = resp.extintores;
      // cada ves al crear extintor actualizar una propiedad en empresa llamada extintores numero
      //servira para mostrar empresas sin o con extintores validacion
    })
  }

}
