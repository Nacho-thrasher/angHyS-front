interface _empresaUser{
  _id: string;
  nombre: string;
  img: string;
}

export class Empresa {

  constructor(
    public nombre: string,
    public localidad: string,
    public direccion: string,
    public _id?: string,
    public img?: string,
    public usuario?: _empresaUser

  ){

  }

}

