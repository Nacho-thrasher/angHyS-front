import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {

  transformRes(img: string, tipo: 'usuarios'|'empresas'|'extintores'): string {
    console.log(img)
    if ( !img ) {
      return `${ base_url }/upload/${tipo}/no-image`;
    } else if ( img.includes('https') ) {
        return img;
    } else if ( img ) {
        return `${ base_url }/upload/${tipo}/${ img }`;
    } else {
        return `${ base_url }/upload/${tipo}/no-image`;
    }

  }
  transform(img: string, tipo: 'usuarios'|'empresas'|'extintores'): string {
    //console.log(`${ base_url }/cloudinary/${ img }`)
    if ( !img ) {
      return `${ base_url }/cloudinary/${tipo}/no-image`;
    } else if ( img.includes('https') ) {
        return img;
    } else if ( img ) {
      return img;
    } else {
        return `${ base_url }/cloudinary/${tipo}/no-image`;
    }

  }

}
