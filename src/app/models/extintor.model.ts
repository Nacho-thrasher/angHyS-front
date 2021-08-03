import { Empresa } from "./empresa.model";

interface _extintorUser{
  _id: string;
  nombre: string;
  img: string;
}

export class Extintor {

  constructor(
    public numeroSerie: string,
    public marca: string,
    public agenteExtintor: string,
    public capacidad: string,
    public empresa: Empresa,
    public _id?: string,
    public img?: string

  ){

  }

}

