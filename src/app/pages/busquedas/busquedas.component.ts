import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';

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

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private busquedasService: BusquedasService) { }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe( ({termino}) => {
      //console.log(termino);
      //this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
      this.busquedaGlobal(termino);
    })
  }

  busquedaGlobal(termino: string){
    this.busquedasService.busquedaGlobal(termino)
    .subscribe( (resp:any) => {
      console.log(resp);
      this.usuarios = resp.usuarios;
      this.empresas = resp.empresas;
      this.extintores = resp.extintores;

    })
  }

  

}
