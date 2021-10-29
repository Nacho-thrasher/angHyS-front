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

@Component({
  selector: 'app-actualizar-inspeccion',
  templateUrl: './actualizar-inspeccion.component.html',
  styleUrls: ['./actualizar-inspeccion.component.css']
})
export class ActualizarInspeccionComponent implements OnInit {

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

  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private extintorService: ExtintorService,
    private router: Router) { }

  ngOnInit(): void {

    this.cargarEmpresas();
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
      const workbook = XLSX.read(bstr, { type: 'binary', cellDates: true });

      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const JSON_Object:any = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.JSONObject.object = JSON_Object; //Data in JSON Format
      this.str = JSON_Object;
      //? para tablas /////////////////////////
      this.keys = Object.keys(this.str[0]);
      this.dataSheet.next(this.str);
      //? comprobar nro serie /////////////////
      // this.comprobarNroSerie();
      //? console log y output text ///////////
      this.JSONObject.string = JSON.stringify(this.str); //Data in String Format
      console.log(this.str); //
    };
    fileReader.readAsArrayBuffer(this.file);
    this.cargandoTable = true;
  }

  //terminar hoy en la tarde es importante

  removeData() {
    this.cargandoTable = false;
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = [];
  }

}
