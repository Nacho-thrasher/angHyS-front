import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
//other imports
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
  selector: 'app-extintores-excel',
  templateUrl: './extintores-excel.component.html',
  styles: [
  ]
})
export class ExtintoresExcelComponent implements OnInit {

  public empresas: Empresa[] = [];
  public empresaSeleccionados?: Empresa;
  public extintorForm!: FormGroup;
  public extintorSeleccionados?: Extintor;
  public empresaSel!: string;
  public cantExt!: number;
  // for tables
  public arrayBuffer: any;
  public file!: File;
  public str!: any;
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
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarEmpresas();

    this.extintorForm = this.fb.group({
      empresa: ['', Validators.required],
    })

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
  // incomingfile(event:any) {
  // }
  upload(event:any) {

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
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const JSON_Object:any = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      this.JSONObject.object = JSON_Object; //Data in JSON Format
      this.str = JSON_Object;

      // para tablas
      this.keys = Object.keys(this.str[0]);
      this.dataSheet.next(this.str);
      // console log y output text
      this.JSONObject.string = JSON.stringify(this.str); //Data in String Format
      console.log(`JSON object cant:${this.str.length}`, this.str);

    };
    fileReader.readAsArrayBuffer(this.file);

  }

  guardarExtintor(){
    //*Crear
    try {
      const { empresa } = this.extintorForm.value;
      for(let index = 0; index < this.str.length; index++){
        // pushear empresa
        this.str[index].empresa = (`${empresa}`);
        //creando
        this.extintorService.crearExtintorXlsx(this.str[index])
        .subscribe( (resp:any) => {
          //preload aqui?
        })
      }
      if (this.empresaSeleccionados?.nroExtintores === undefined) {
        this.cantExt = +this.str.length;
      }
      else {
        this.cantExt = +this.empresaSeleccionados?.nroExtintores! + this.str.length
      }
      const data = {
        nombre: this.empresaSeleccionados?.nombre,
        nroExtintores: this.cantExt.toString(),
        _id: this.empresaSeleccionados?._id
      }
      this.empresaService.actualizarNroExtEmpresa(data)
      .subscribe(resp =>{

      })
      //todo aqui insertar en empresas numero + sumar extintores creados
      Swal.fire('Creado', `(${this.str.length}) Extintores creados`, 'success')
      this.router.navigateByUrl(`/dashboard/extintores`)
      //? aqui actualizar nro extintor

    } catch (error) {
      console.log(error)
      Swal.fire('Error', `error`, 'error')
    }

  }

  removeData() {
    this.inputFile.nativeElement.value = '';
    this.dataSheet.next(null);
    this.keys = [];
  }

}
