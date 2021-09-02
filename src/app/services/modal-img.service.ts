import { Injectable, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImgService {

  public tipo!: 'usuarios'|'empresas'|'extintores';
  public id?: string;
  public img!: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  private _ocultarModal:boolean = true;
  // el guin bajo indica q es privada
  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios'|'empresas'|'extintores',
    id?: string,
    img: string = 'no-image'
  ){
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    this.img = img;
    if (img.includes('https')) {
      this.img = img;
    }
    else{
      this.img = `${base_url}/cloudinary/${tipo}/no-image`;
    }
    //console.log(this.img)
  }
  cerrarModal(){
    this._ocultarModal = true;
  }

  constructor() { }



}
