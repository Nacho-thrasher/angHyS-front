import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Extintor } from '../models/extintor.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ExtintorService {

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

  cargarExtintores(){

    const url = `${base_url}/extintores`;
    return this.http.get<{ ok: boolean, extintores: Extintor[] }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, extintores: Extintor[] } ) => resp.extintores)
    )
    //delay() , va con pipe antes de map para demorar la carga
  }

  cargarExtintorById(id:string){

    const url = `${base_url}/extintor/${id}`;
    return this.http.get<{ ok: boolean, extintores: Extintor }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, extintores: Extintor } ) => resp.extintores)
    )
  }

  cargarExtintoresByEmpresa(id: string){
    const url = `${base_url}/vista-empresas/${id}`;
    return this.http.get(url, this.headers)
  }

  cargarExtintoresByNumSerie(numSerie: string){
    const url = `${base_url}/vista-extintor/${numSerie}`;
    return this.http.get(url, this.headers)
  }

  crearExtintor(extintor:
    {
      numeroSerie: string,
      agenteExtintor:string,
      capacidad:string,
      marca: string,
      fechaFabricacion: string,
      proxRecarga: string,
      vtoPh: string,
      reposiciones: string,
      cambio: string,
      cantidadKg: string,
      discoSeg: string,
      manija: string,
      calco: string,
      ruedas: string,
      manguera: string,
      tobera: string,
      trabaS: string,
      oring: string,
      valvula: string,
      vastago: string,
      manometro: string,
      canioP: string,
      pintura: string,
      soporte: string,
      ph: string,
      estampilla: string,
      empresa:string,
    }){

    const url = `${base_url}/extintores`;
    return this.http.post(url, extintor, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }

  crearExtintorXlsx(extintor: Extintor){

    const url = `${base_url}/extintores`;
    return this.http.post(url, extintor, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }



  actualizarExtintor(extintor:Extintor){

    const url = `${base_url}/extintores/${extintor._id}`;
    return this.http.put(url, extintor, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }

  borrarExtintor(_id:string){

    const url = `${base_url}/extintores/${_id}`;
    return this.http.delete(url, this.headers)
    //delay() , va con pipe antes de map para demorar la carga
  }


}
