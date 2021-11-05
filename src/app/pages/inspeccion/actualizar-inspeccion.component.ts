import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import * as XLSX from 'xlsx';
import { ExtintorService } from 'src/app/services/extintor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Extintor } from 'src/app/models/extintor.model';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-actualizar-inspeccion',
  templateUrl: './actualizar-inspeccion.component.html',
  styleUrls: ['./actualizar-inspeccion.component.css']
})
export class ActualizarInspeccionComponent implements OnInit {

  public enableSend:boolean = false;

  public empresas: Empresa[] = [];
  public empresaSeleccionados?: Empresa;
  public extintorForm!: FormGroup;
  public extintorSeleccionados?: Extintor;
  public empresaSel!: string;
  public cantExt!: number;
  public extintores: Extintor[] = [];
  public cargandoTable: boolean = false;
  // for tables
  public arrayBuffer: any;
  public file!: File;
  public str!: any;

  public arreglado!:any;
  public arreglado2!:any;

  public lengthFile!:string;
  public repetidosFile: number = 0;

  public indexPreload: number = 0;
  public preload!: boolean;

  public noRepeatObject:any;
  public JSONObject = {
    object: {},
    string: ''
  };
  keys!: string[];
  @ViewChild('inputFile') inputFile!: ElementRef;
  isExcelFile!: boolean;
  spinnerEnabled = false;
  dataSheet:any = new Subject();
  //? incidencias
  public carro_defectuoso:boolean = false;
  public equipo_usado:boolean = false;
  public pintura:boolean = false;
  public equipo_despresurizado:boolean = false;
  public altura:boolean = false;
  public senializacion_chapa:boolean =false
  public senializacion_altura:boolean = false
  public falta_tarjeta:boolean = false
  public precinto:boolean = false
  public soporte:boolean=false
  public ruptura:boolean = false
  public manguera:boolean = false

  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private extintorService: ExtintorService,
    private router: Router) { }

  ngOnInit(): void {

  }

  // to json string
  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
    .subscribe((empresas: Empresa[]) => {
      //console.log(empresas);
      this.empresas = empresas;
    })
  }

  //* other methods efective ===================================
  upload(event:any) {
    this.cargandoTable = false;
    this.enableSend = true;

    this.file = event.target.files[0];
    if (event.target.files.length > 1) {
      this.inputFile.nativeElement.value = '';
    }
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      const data = new Uint8Array(this.arrayBuffer);
      const arr = new Array();
      for (let i = 0; i !== data.length; ++i) { arr[i] = String.fromCharCode(data[i]); }

      const bstr = arr.join('');
      const workbook = XLSX.read(bstr, { type: 'binary', cellDates: true, dateNF: 'm/d/yy' });

      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const JSON_Object:any = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      this.JSONObject.object = JSON_Object; //Data in JSON Format
      this.str = JSON_Object;
      //? para tablas /////////////////////////
      // this.keys = Object.keys(this.str[0]);
      // this.dataSheet.next(this.str);
      //? comprobar nro serie /////////////////
      this.tableRefactor();
      //? console log y output text ///////////
      //this.JSONObject.string = JSON.stringify(this.str); //Data in String Format
      //console.log(this.str); //

    };
    fileReader.readAsArrayBuffer(this.file);
    this.cargandoTable = true;
  }

  tableRefactor(){
    this.arreglado = this.str.map( (item:any) => {
      return{
        fechaInspeccion: item.FechaHora,
        cliente: item.Cliente,
        sucursal: item.Sucursal,
        puesto: item.Puesto,
        estado: item.Estado,
        observacion: item.Observaciones == undefined ? 'no' : item.Observaciones,
        elemento: item.Elemento,
        detalle_elemento: item.DetalleElemento,
        cumple:	item.Cumple,
        incidencias: item.Incidencias == undefined ? 'no' : item.Incidencias
      }
    })

    for(let index = 0; index < this.arreglado.length; index++){
      if (this.arreglado[index].estado == 'Realizada') {
        this.arreglado = this.arreglado.filter(function(car:any) {
            return car.estado !== 'No Realizada';
        });
        //console.log(this.arreglado[index])
      }
    }
    this.keys = Object.keys(this.arreglado[0]);
    this.dataSheet.next(this.arreglado);
    //console.log(this.arreglado)
    // this.alctualizarInspeccion();
  }

  alctualizarInspeccion(){
    //console.log(this.arreglado)
    try {
      for(
        let index = 0;
        index < this.arreglado.length;
        index++
      ){
        //? nro serie para actualizar inspeccion
        let element = this.arreglado[index].elemento.split(" ")
        let nroSerie = element[0]
        //console.log(nroSerie)
        //? variables
        let fecha = this.arreglado[index].fechaInspeccion;
        let estado = this.arreglado[index].estado;
        let observacion = this.arreglado[index].observacion;
        let cumple = this.arreglado[index].cumple;
        let incidencia = this.arreglado[index].incidencias;
        //console.log(fecha)
        //? vto ph etc
        //let detailElmento = this.arreglado[index].detalle_elemento.split(" ");
        //let guardado1 = detailElmento[0].split(":");
        //let ff = guardado1[1];
        //let guardado2 = detailElmento[3].split(":");
        // let vtoCarga = guardado2[1];
        // let guardado3 = detailElmento[5].split(":");
        // let vtoPh = guardado3[1];
        //console.log(ff, vtoCarga, vtoPh)
        //?incidencias
        //incidencia.toLowerCase();
        if (incidencia.indexOf('Carro Defectuoso') !== -1) {
          this.carro_defectuoso = true;
        }else{ this.carro_defectuoso = false; }
        if (incidencia.indexOf('Equipo Usado') !== -1) {
          this.equipo_usado = true;
        }else{ this.equipo_usado = false; }
        if (incidencia.indexOf('Equipo Despintado') !== -1) {
          this.pintura = true;
        }else{ this.pintura = false; }
        if (incidencia.indexOf('Equipo Despresurizado') !== -1) {
          this.equipo_despresurizado = true;
        }else{ this.equipo_despresurizado = false; }
        if (incidencia.indexOf('Altura Incorrecta') !== -1) {
          this.altura = true;
        }else{ this.altura = false; }
        if (incidencia.indexOf('Falta Señalizacion en Chapa') !== -1) {
          this.senializacion_chapa = true;
        }else{ this.senializacion_chapa = false; }
        if (incidencia.indexOf('Falta Señalizacion en Altura') !== -1) {
          this.senializacion_altura = true;
        }else{ this.senializacion_altura = false; }
        if (incidencia.indexOf('Falta Tarjeta') !== -1) {
          this.falta_tarjeta = true;
        }else{ this.falta_tarjeta = false; }
        if (incidencia.indexOf('Falta Precinto') !== -1) {
          this.precinto = true;
        }else{ this.precinto = false; }
        if (incidencia.indexOf('Soporte Defectuoso') !== -1) {
          this.soporte = true;
        }else{ this.soporte = false; }
        if (incidencia.indexOf('Medio Ruptura Ausente') !== -1) {
          this.ruptura = true;
        }else{ this.ruptura = false; }
        if (incidencia.indexOf('Manguera Rota') !== -1) {
          this.manguera = true;
        }else{ this.manguera = false; }

        //console.log(incidencia)
        //? actualizar inspeccion
        const data = {
          nroSerie: nroSerie,
          fecha: fecha,
          estado: estado,
          observacion: observacion,
          cumple: cumple,
          //incidencia: incidencia,
          //ff: ff,
          //vtoCarga: vtoCarga,
          //vtoPh: vtoPh,
          //
          carro_defectuoso: this.carro_defectuoso,
          equipo_usado: this.equipo_usado,
          pintura: this.pintura,
          equipo_despresurizado: this.equipo_despresurizado,
          altura: this.altura,
          senializacion_chapa: this.senializacion_chapa,
          senializacion_altura: this.senializacion_altura,
          falta_tarjeta: this.falta_tarjeta,
          precinto: this.precinto,
          soporte: this.soporte,
          ruptura: this.ruptura,
          manguera: this.manguera
        }
        //console.log(data)
        this.extintorService.actualizarInspeccion(data)
        .subscribe( (resp:any) => {
          //console.log(resp)
        })

      }
      Swal.fire('Actualizado', `Extintores actualizados.`, 'success')


    } catch (error) {
      console.log(error);
    }
  }

  removeData() {
    this.enableSend = false;
    this.cargandoTable = false;
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = [];
  }

}
