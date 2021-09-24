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

  cargarIdEmpresa(empresaNombre: string){
    const url = `${base_url}/empresaNombre/${empresaNombre}`;
    return this.http.get(url, this.headers);
  }

  cargarEmpresaById(id:string){

    const url = `${base_url}/empresa/${id}`;
    return this.http.get<{ ok: boolean, empresas: Empresa }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, empresas: Empresa }) => resp.empresas )
    )
  }

  crearEmpresa(empresa: {nombre:string, localidad:string, direccion:string}){

    const url = `${base_url}/empresas`;
    return this.http.post(url, empresa, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }

  actualizarEmpresa(empresa:Empresa){

    const url = `${base_url}/empresas/${empresa._id}`;
    return this.http.put(url, empresa, this.headers)
    //delay() , va con pipe antes de map para demorar la carga

  }

  actualizarNroExtEmpresa(data: any){
    const url = `${base_url}/empresas/${data._id}`;
    return this.http.put(url, data, this.headers)
  }

  borrarEmpresa(_id:string){

    const url = `${base_url}/empresas/${_id}`;
    return this.http.delete(url, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }


}
