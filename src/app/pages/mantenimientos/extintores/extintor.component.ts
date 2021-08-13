import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ExtintorService } from 'src/app/services/extintor.service';
import Swal from 'sweetalert2';

import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels, NgxQRCodeModule } from 'ngx-qrcode2';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Component({
  selector: 'app-extintor',
  templateUrl: './extintor.component.html',
  styles: [
  ]
})
export class ExtintorComponent implements OnInit {

  public extintorForm!: FormGroup;
  public empresas: Empresa[] = [];
  public empresaSeleccionados?: Empresa;
  public extintorSeleccionados?: Extintor;


  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private extintorService: ExtintorService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

    //? qr vars -
    public title!: string;
    public url!:string;
    public profile!:string;
    public elementType = NgxQrcodeElementTypes.URL;
    public errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
    public value!:string;
    public numerSer!:string;
    //todo oninit
    ngOnInit(): void {
    //todo Obtener ID
    this.activatedRouter.params.subscribe(({id}) =>{
      this.cargarExtintor(id);
    })
    //todo Validators form
    this.extintorForm = this.fb.group({
      numeroSerie: ['', Validators.required],
      marca: ['', Validators.required],
      agenteExtintor: ['', Validators.required],
      capacidad: ['', Validators.required],
      empresa: ['', Validators.required],
    })
    //todo Cargar empresas y seleccionar si muestro
    this.cargarEmpresas();
    this.extintorForm.get('empresa')?.valueChanges
    .subscribe(empresaId =>{
      this.empresaSeleccionados = this.empresas
      .find( h => h._id === empresaId);
    })
  }
  //todo QR
  cargarQr(numeroSerie:string){
    this.title = 'app';
    this.url = 'http://localhost:4400/dashboard/vista-extintor/';
    this.profile = `${numeroSerie}`;
    //console.log(this.profile);
    this.elementType = NgxQrcodeElementTypes.URL;
    this.errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
    this.value = this.url + this.profile;
  }
  //* Cargar Extintor
  cargarExtintor(id:string){
    if (id === 'nuevo') {  return; }

    this.extintorService.cargarExtintorById(id)
    .pipe(
      delay(100)
    ).subscribe(extintor =>{
      if (!extintor) {
        this.router.navigateByUrl(`/dashboard/extintores`);
        return;
      }
      const {
              numeroSerie,
              agenteExtintor,
              capacidad,
              marca,
              empresa:{_id}
      } = extintor;
      //* Asignando numero a qr
      this.numerSer = extintor.numeroSerie!;
      this.cargarQr(this.numerSer);
      //* Cargando inputs de form
      this.extintorSeleccionados = extintor;
      this.extintorForm.setValue({
          numeroSerie,
          agenteExtintor,
          capacidad,
          marca,
          empresa: _id!
      })
    });
  }
  //* Cargar Empresas
  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
    .subscribe((empresas: Empresa[]) => {
      //console.log(empresas);
      this.empresas = empresas;
    })
  }
  //* Guardar
  guardarExtintor(){
    const { numeroSerie, marca } = this.extintorForm.value;
    if (this.extintorSeleccionados) {
        //todo update
        const data = {
          ...this.extintorForm.value,
          _id: this.extintorSeleccionados._id
        }
        this.extintorService.actualizarExtintor(data)
        .subscribe(resp =>{
          Swal.fire('Actualizado', `Extintor: ${numeroSerie} - Marca: ${marca}.`, 'success')
          this.router.navigateByUrl(`/dashboard/extintores`)
        })
    }
    else{
        //todo crear
        const { numeroSerie, marca } = this.extintorForm.value;
        this.extintorService.crearExtintor(this.extintorForm.value)
        .subscribe( (resp:any) => {
          Swal.fire('Creado', `Extintor: ${numeroSerie} - Marca: ${marca}.`, 'success')
          this.router.navigateByUrl(`/dashboard/extintor/${ resp.extintor._id }`)
        })
    }
  }



}
