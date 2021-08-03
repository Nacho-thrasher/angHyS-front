import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Empresa } from '../models/empresa.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

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

  cargarEmpresas(){

    const url = `${base_url}/empresas`;
    return this.http.get<{ ok: boolean, empresas: Empresa[] }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, empresas: Empresa[] } ) => resp.empresas)
    )
    //delay() , va con pipe antes de map para demorar la carga
  }

  crearEmpresa(nombre:string){

    const url = `${base_url}/empresas`;
    return this.http.post(url, {nombre}, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }

  actualizarEmpresa(_id:string, nombre:string){

    const url = `${base_url}/empresas/${_id}`;
    return this.http.put(url, {nombre}, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }

  borrarEmpresa(_id:string){

    const url = `${base_url}/empresas/${_id}`;
    return this.http.delete(url, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }


}
