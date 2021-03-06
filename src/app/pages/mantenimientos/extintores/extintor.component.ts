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
import { environmentQr } from '../../../../environments/enviromentQr';
import { FileUploadService } from 'src/app/services/file-upload.service';

const base_url = environmentQr.base_url;
const base_urlImg = environment.base_url;

@Component({
  selector: 'app-extintor',
  templateUrl: './extintor.component.html',
  styles: [
  ],
  styleUrls:['./extintor.css']
})
export class ExtintorComponent implements OnInit {

  public extintorForm!: FormGroup;
  public empresas: Empresa[] = [];
  public empresaSeleccionados?: Empresa;
  public extintorSeleccionados?: Extintor;
  public ifIsNew!: boolean;
  //? qr vars -
  public title!: string;
  public url!:string;
  public profile!:string;
  public elementType = NgxQrcodeElementTypes.URL;
  public errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  public value!:string;
  public numerSer!:string;
  public cantExt!: number;
  //? imgs wid var
  public imgViene!: string;
  public imagenSubir!: File; //img1
  public imagenRem!: File;
  public imgTemp: any = null;

  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private extintorService: ExtintorService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private fileUploadService: FileUploadService) { }

    //todo oninit
    ngOnInit(): void {
    //todo Obtener ID
    this.activatedRouter.params.subscribe(({id}) =>{
      if (id === 'nuevo') {
        this.ifIsNew = true;
        this.questionIsNew();
      }
      else{
        this.ifIsNew = false;
        this.cargarExtintor(id);
      }
    })
    //todo Validators form
    this.extintorForm = this.fb.group({
      identificadorSysExt: ['', Validators.required],
      numeroSerie: ['', Validators.required],
      marca: ['', Validators.required],
      agenteExtintor: ['', Validators.required],
      capacidad: ['', Validators.required],
      empresa: ['', Validators.required],
    })
    //todo Cargar empresas y seleccionar si muestro
    this.cargarEmpresas();
    this.extintorForm.get('empresa')!.valueChanges
    .subscribe(empresaId =>{
      this.empresaSeleccionados = this.empresas
      .find( h => h._id === empresaId);
      // console.log(this.empresaSeleccionados?.nroExtintores)
    })
  }
  //?
  questionIsNew(){
    if (this.ifIsNew === true) {
      $(`#formCreateExt`).removeClass("col-md-6");
      $(`#formCreateExt`).addClass("col-md-12");
    }else{
      $(`#formCreateExt`).removeClass("col-md-12");
      $(`#formCreateExt`).addClass("col-md-6");
    }
  }

  //todo QR
  cargarQr(numeroSerie:string){
    this.title = 'app';
    this.url = `${base_url}/dashboard/vista-extintor/`;
    //es id
    this.profile = `${numeroSerie}`;
    this.elementType = NgxQrcodeElementTypes.URL;
    this.errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
    this.value = this.url + this.profile;
  }
  //* Cargar Extintor
  cargarExtintor(id:string){
    if (id === 'nuevo') { this.ifIsNew = true;  return; }
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
              empresa:{_id},
              identificadorSysExt
      } = extintor;
      //console.log(extintor);
      //*pdf img
      if (extintor.pdf === undefined || extintor.pdf === '') {
        this.imgViene = `${base_urlImg}/cloudinary/extintores/no-image`
      }else{ this.imgViene = extintor.pdf; }
      //* Asignando numero a qr
      this.numerSer = extintor._id!;
      this.cargarQr(this.numerSer);
      //* Cargando inputs de form
      this.extintorSeleccionados = extintor;
      this.extintorForm.setValue({
        identificadorSysExt,
          numeroSerie,
          agenteExtintor,
          capacidad,
          marca,
          empresa: _id!
      })
    });
  }
  //* transform img
  transformImg(img:string):string {
    //console.log(this.usuario.img)
    const myArr = img.split("/");
    let imagen = '';
    for (let i = 0; i < myArr.length; i++) {
      if (i + 1 === myArr.length) {
        imagen = imagen + myArr[i]
      }
      else {
        if (myArr[i] === 'upload') {
          imagen = imagen + myArr[i] + '/c_thumb,h_300,w_400/'
        }else {
          imagen = imagen + myArr[i] + '/'
        }
      }
    }
   return imagen;
  }
  //? cambiar imgs
  cambiarImagen(e: any):any {
    //this.cargandoImg = true;
    const file = e.target.files[0] || e.dataTransfer.files[0]
    if (file) {

      this.imagenSubir = file;
      if (!file) {
        return this.imgTemp = null;
      }
      const reader = new FileReader();
      reader.onloadend = () =>{
        $('#imagePreview')
        .css('background-image', 'url('+reader.result +')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
        this.imgTemp = reader.result;
      }
      reader.readAsDataURL(file);
      //this.cargandoImg = false;
    }
  }
  //* Cargar Empresas
  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
    .subscribe((empresas: Empresa[]) => {
      this.empresas = empresas;
    })
  }
  //* pdfs
  upload(e: any):any {
    //this.cargandoImg = true;
    const file = e.target.files[0] || e.dataTransfer.files[0]
    if (file) {
      this.imagenSubir = file;
      //console.log(this.imagenSubir)
      if (!file) {
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () =>{
        reader.result;
      }
      reader.readAsDataURL(file);
      //this.cargandoImg = false;
    }
  }
  removeData() {
    if (this.extintorSeleccionados?.pdf === undefined) {
      this.imgViene = `${ base_url }/cloudinary/extintor/no-image`;
    }
    else{
      this.imgViene = this.extintorSeleccionados.pdf;
    }
    this.imagenSubir = this.imagenRem;
    $('#imagePreview')
    .css('background-image', `url(${this.imgViene})`);
    $('#imagePreview').hide();
    $('#imagePreview').fadeIn(650);
  }
  //* Guardar
  guardarExtintor(){
    let validacion:boolean = true;
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
        })
        if (this.imagenSubir !== this.imagenRem) {
          Swal.fire({
            title: "Subiendo Archivo",
            text: "Por favor espere",
            imageUrl: "https://www.epgdlaw.com/wp-content/uploads/2017/09/ajax-loader.gif",
            showConfirmButton: false,
            allowOutsideClick: false
          });
          this.fileUploadService
          .actualizarPdf( this.imagenSubir, 'extintores', this.extintorSeleccionados._id )
          .then( img => {
            this.router.navigateByUrl(`/dashboard/extintores`)
            setTimeout(() => {
              Swal.close();
            }
            , 400);
          }).catch( err => {
            //console.log(err);
            Swal.fire('Error', 'No se pudo subir la imagen 1', 'error');
          })
        }
    }
    else{
        //todo crear
        const { numeroSerie, marca } = this.extintorForm.value;
        this.extintorService.crearExtintor(this.extintorForm.value)
        .subscribe( (resp:any) => {
          if (resp.ok === false) {
            validacion = false;
            Swal.fire('Error', `Extintor: ${numeroSerie} ya existe.`, 'error')
          }
          else{
            Swal.fire('Creado', `Extintor: ${numeroSerie} - Marca: ${marca}.`, 'success')

          }
          if (this.imagenSubir !== this.imagenRem) {
            Swal.fire({
              title: "Subiendo Imagenes",
              text: "Por favor espere",
              imageUrl: "https://www.epgdlaw.com/wp-content/uploads/2017/09/ajax-loader.gif",
              showConfirmButton: false,
              allowOutsideClick: false
            });
            this.fileUploadService
            .actualizarPdf( this.imagenSubir, 'extintores', this.extintorSeleccionados?._id )
            .then( img => {
              Swal.close();
            }).catch( err => {
              //console.log(err);
              Swal.fire('Error', 'No se pudo subir la imagen 1', 'error');
            })
          }
          if (validacion === true) {
            //? aqui actualizar nro extintor
            if (this.empresaSeleccionados?.nroExtintores === undefined) {
              this.cantExt = 1;
            }
            else {
              this.cantExt = +this.empresaSeleccionados?.nroExtintores! + 1
            }
            const data = {
              nombre: this.empresaSeleccionados?.nombre,
              nroExtintores: this.cantExt.toString(),
              _id: this.empresaSeleccionados?._id
            }
            this.empresaService.actualizarNroExtEmpresa(data)
            .subscribe(resp =>{
              this.router.navigateByUrl(`/dashboard/extintores`)
            })
          }
        })

    }
  }



}
