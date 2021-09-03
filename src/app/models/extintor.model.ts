import { Empresa } from "./empresa.model";

interface _extintorUser{
  _id: string;
  nombre: string;
  img: string;
}

export class Extintor {

  constructor(
    public numeroSerie: string,
    public agenteExtintor: string,
    public capacidad: string,
    public marca: string,

    public fechaFabricacion: string,
    public proxRecarga: string,
    public vtoPh: string,
    public reposiciones: string,
    public cambio: string,
    public cantidadKg: string,
    public discoSeg: string,
    public manija: string,
    public calco: string,
    public ruedas: string,
    public manguera: string,
    public tobera: string,
    public trabaS: string,
    public oring: string,
    public valvula: string,
    public vastago: string,
    public manometro: string,
    public canioP: string,
    public pintura: string,
    public soporte: string,
    public ph: string,
    public estampilla: string,

    public empresa: Empresa,
    public _id?: string,
    public img?: string,
    public img2?: string,

    public zona?: string,
    public numInterno?: string,
    public acceso?: string,
    public demarcado?: string,
    public estadoManometro?: string,
    public estadoPintura?: string,
    public estadoChapaBaliza?: string,
    public estadoManija?: string,
    public retiroPorMant?: string,
    public sustituto?: string,
    public numeroSustituto?: string,
    public observacion?: string,
    public cliente?: string,
    public pdf?: string

  ){

  }

}

