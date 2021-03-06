import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { HttpClient } from "@angular/common/http";

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private http: HttpClient) { }

  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'extintores'|'empresas',
    id?: string
  ){
    try {

      const url = `${base_url}/cloudinary/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('img', archivo);
      //* se puede seguir agregando items

      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if ( data.ok ) {
        //console.log(data)
        return data.nombreAr;
      } else {
        //console.log(data.msg);
        return false;
      }
    }
    catch (error) {
      //console.log(error);
      return false;
    }
  }
  //* Imagen 2
  async actualizarFoto2(
    archivo: File,
    tipo: 'usuarios'|'extintores'|'empresas',
    id?: string
  ){
    try {

      const url = `${base_url}/cloudinary2/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('img2', archivo);
      //* se puede seguir agregando items

      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if ( data.ok ) {
        return data.nombreAr;
      } else {
        //console.log(data.msg);
        return false;
      }
    }
    catch (error) {
      //console.log(error);
      return false;
    }
  }
  //* actualizarPdf
  async actualizarPdf(
    archivo: File,
    tipo: 'usuarios'|'extintores'|'empresas',
    id?: string
  ){
    try {

      const url = `${base_url}/cloudinaryPdf/${tipo}/${id}`;
      const formData = new FormData();
      formData.append('pdf', archivo);
      //* se puede seguir agregando items

      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      const data = await resp.json();

      if ( data.ok ) {
        //console.log(data)
        return data.nombreAr;
      } else {
        //console.log(data.msg);
        return false;
      }
    }
    catch (error) {
      //console.log(error);
      return false;
    }
  }
}
