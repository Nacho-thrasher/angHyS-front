import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa.model';
import { Extintor } from '../models/extintor.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor(private http: HttpClient) { }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  private transformarUsuarios(resultados: any[]):Usuario[]{
    return resultados.map(
      user =>new Usuario(

        user.nombre,
        user.email,
        '',
        user.img,
        user.google,
        user.role,
        user.uid

      )
    )
  }

  private transformarEmpresas(resultados: any[]):Empresa[] {
    return resultados;
  }

  private transformarExtintores(resultados: any[]):Extintor[] {
    return resultados;
  }

  busquedaGlobal(termino: string){
    const url = `${base_url}/todo/${termino}`;
    return this.http.get(url, this.headers)
  }

  buscar(
    tipo:'usuarios'|'empresas'|'extintores',
    termino: string
  ){
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    return this.http.get<any[]>(url, this.headers)
    .pipe(
      map((resp:any):any => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(resp.resultados);

          case 'empresas':
            return this.transformarEmpresas(resp.resultados);

          case 'extintores':
            return this.transformarExtintores(resp.resultados);

          default:
            return [];
        }
      })
    )

  }

}
