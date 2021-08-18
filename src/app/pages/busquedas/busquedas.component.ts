import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { UsuarioService } from 'src/app/services/usuario.service';

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

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private busquedasService: BusquedasService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.activatedRoute.params
    .subscribe( ({termino}) => {
      //console.log(termino);
      //this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
      this.busquedaGlobal(termino);
    })
  }

  busquedaGlobal(termino: string){
    this.cargando = true;
    this.busquedasService.busquedaGlobal(termino)
    .subscribe( (resp:any) => {
      if (this.usuarioService.role === 'ADMIN_ROLE') {
        this.usuarios = resp.usuarios;
      }
      this.empresas = resp.empresas;
      this.extintores = resp.extintores;
      //console.log(resp);
      this.cargando = false;
    })
  }

  navigate(nombre:any){
    let text1 = nombre.replace(/ /g, "_");
    this.router.navigateByUrl(`/dashboard/vista-empresas/${text1}`)
  }

  //? Si es usuario o admin
  isUFunc(){
    if (this.usuarioService.role === 'USER_ROLE') {
      return true;
    }
    else{
      return false;
    }
  }
}
