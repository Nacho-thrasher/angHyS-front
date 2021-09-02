import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { Usuario } from 'src/app/models/usuario.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ExtintorService } from 'src/app/services/extintor.service';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';
import { environment } from '../../../../environments/environment';

declare var $: any;

const base_url = environment.base_url;

@Component({
  selector: 'app-view-extintor',
  templateUrl: './view-extintor.component.html',
  styles: [

  ],
  styleUrls:[
    './view-extintor.component.css'
  ]
})
export class ViewExtintorComponent implements OnInit {

  //? IMG 1
  public imagenSubir!: File; //img1
  public imagenRem!: File;
  public imgTemp: any = null;
  public imgViene!: string;
  //? IMG 2
  public imagenSubir2!: File; //img2
  public imgTemp2: any = null;
  public imgViene2!: string;
  //? otras vars
  public extintorForm!: FormGroup;
  public empresas: Empresa[] = [];
  public empresaSeleccionados?: Empresa;
  public extintor!: Extintor;
  public cargando?: boolean = true;
  public cargandoImg?: boolean = false;
  public extintorSeleccionados?: Extintor;
  public dtOptions: DataTables.Settings = {};
  //? variables par aguardar al cargar
  public isUser!:boolean;
  public rutaStart!:string;

  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private extintorService: ExtintorService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) { }

  //todo OnInit
  ngOnInit(): void {
    //datatable options
    this.dtOptions = {
      responsive: true,
      info: false,
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' }
    };
    //todo obtener parametro url
    this.activatedRouter.params
    .subscribe( ({numSerie}) => {
      // console.log(numSerie);
      this.cargarExtintor(numSerie);
    })
    //todo Validators form
    this.extintorForm = this.fb.group({
      zona: ['', Validators.required],
      numInterno: ['', Validators.required],
      acceso: ['', Validators.required],
      demarcado: ['', Validators.required],
      estadoManometro: ['', Validators.required],
      estadoPintura: ['', Validators.required],
      estadoChapaBaliza: ['', Validators.required],
      estadoManija: ['', Validators.required],
      retiroPorMant: ['', Validators.required],
      sustituto: ['', Validators.required],
      numeroSustituto: ['', Validators.required],
      observacion: ['', Validators.required],
      _id: ['', Validators.required],
      numeroSerie: ['', Validators.required]
    })
  }
  //todo Cargar extintor
  cargarExtintor(numSerie: string){
    //? preload
    this.cargando = true;
    //? ALservice extintor por numserie
    this.extintorService.cargarExtintoresByNumSerie(numSerie)
    .subscribe( (resp:any) => {
      //? si no existe extintor retorna atras
      if (resp.extintor === undefined) {
        this.router.navigateByUrl(`/dashboard/vista-empresas`);
        return;
      }
      //? asignando para mostrar y preload
      this.extintor = resp.extintor;
      if (this.extintor.img === undefined) {
        this.imgViene = `${ base_url }/cloudinary/extintor/no-image`;
      }
      else{
        this.imgViene = this.extintor.img;
      }
      if (this.extintor.img2 === undefined) {
        this.imgViene2 = `${ base_url }/cloudinary/extintor/no-image`;
      }
      else{
        this.imgViene2 = this.extintor.img2;
      }
      //?===
      this.rutaStart = base_url;
      //?===
      this.extintorSeleccionados = resp.extintor;
      this.cargando = false;
      //? cargando imputs
      let {
        zona,
        numInterno,
        acceso,
        demarcado,
        estadoManometro,
        estadoPintura,
        estadoChapaBaliza,
        estadoManija,
        retiroPorMant,
        sustituto,
        numeroSustituto,
        observacion,
        empresa: {_id, nombre},
        numeroSerie
      } = resp.extintor;
      //console.log(this.extintor.empresa);
      //? si es la primera ves pregunto
      if (zona === undefined) {
        zona = ''
      }
      if(numInterno === undefined) {
        numInterno = ''
      }
      if(acceso === undefined) {
        acceso = ''
      }
      if(demarcado === undefined) {
        demarcado = ''
      }
      if(estadoManometro === undefined) {
        estadoManometro = ''
      }
      if(estadoPintura === undefined) {
        estadoPintura = ''
      }
      if(estadoChapaBaliza === undefined) {
        estadoChapaBaliza = ''
      }
      if(estadoManija === undefined) {
        estadoManija = ''
      }
      if(retiroPorMant === undefined) {
        retiroPorMant = ''
      }
      if(sustituto === undefined) {
        sustituto = ''
      }
      if(numeroSustituto === undefined) {
        numeroSustituto = ''
      }
      if(observacion === undefined) {
        observacion = ''
      }
      //?  Set inputs
      this.extintorForm.setValue({
        zona,
        numInterno,
        acceso,
        demarcado,
        estadoManometro,
        estadoPintura,
        estadoChapaBaliza,
        estadoManija,
        retiroPorMant,
        sustituto,
        numeroSustituto,
        observacion,
        //? otros
        _id,
        numeroSerie
      })
      //? set divs
      $(document).ready(function() {
        $('.image-popup-no-margins').magnificPopup({
          type: 'image',
          closeOnContentClick: true,
          closeBtnInside: false,
          fixedContentPos: true,
          mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
          image: {
            verticalFit: true
          },
          zoom: {
            enabled: true,
            duration: 300 // don't foget to change the duration also in CSS
          }
        });
      });
    })
  }
  removeDataImg1() {
    if (this.extintor.img === undefined) {
      this.imgViene = `${ base_url }/cloudinary/extintor/no-image`;
    }
    else{
      this.imgViene = this.extintor.img;
    }
    this.imagenSubir = this.imagenRem;
    $('#imagePreview')
    .css('background-image', `url(${this.imgViene})`);
    $('#imagePreview').hide();
    $('#imagePreview').fadeIn(650);
  }
  removeDataImg2() {
    if (this.extintor.img2 === undefined) {
      this.imgViene2 = `${ base_url }/cloudinary/extintor/no-image`;
    }
    else{
      this.imgViene2 = this.extintor.img2;
    }
    this.imagenSubir2 = this.imagenRem;
    $('#imagePreview2')
    .css('background-image', `url(${this.imgViene2})`);
    $('#imagePreview2').hide();
    $('#imagePreview2').fadeIn(650);
  }
  //? cambiar imgs
  cambiarImagen(e: any):any {
    this.cargandoImg = true;
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
      this.cargandoImg = false;
    }
  }
  cambiarImagen2(e: any):any {

    const file = e.target.files[0] || e.dataTransfer.files[0]
    if (file) {
      this.imagenSubir2 = file;
      if (!file) {
        return this.imgTemp2 = null;
      }
      const reader = new FileReader();
      reader.onloadend = () =>{
        $('#imagePreview2')
        .css('background-image', 'url('+reader.result +')');
        $('#imagePreview2').hide();
        $('#imagePreview2').fadeIn(650);
        this.imgTemp2 = reader.result;
      }
      reader.readAsDataURL(file);
    }

  }
  //? Si es usuario o admin
  isUFunc(){
    if (this.usuarioService.role === 'USER_ROLE') {
      return true;
    }
    else{
      return false;
    }
  }
  //? guardar extintor
  guardarExtintor() {
    //*1 ES USUARIO ADMIN O COMUN
    if (this.usuarioService.role === 'USER_ROLE') {
      Swal.fire('No autorizado', 'error', 'error');
      return;
    }
    else{
      //*2 CAPTURAR DATOS EXTINTOR
      if (this.extintorSeleccionados) {
        //todo update
        const id = this.extintorSeleccionados._id;
        const tipo = 'extintores'
        const data = {
          ...this.extintorForm.value,
          _id: this.extintorSeleccionados._id,
          empresa: this.extintorSeleccionados.empresa._id
        }
        this.extintorService.actualizarExtintor(data)
        .subscribe(resp =>{
          //*3 SE ACTUALIZA FORM DE EXTINTOR
        })
        //todo act img
        if (this.imagenSubir !== this.imagenRem) {
          Swal.fire({
            title: "Subiendo Imagenes",
            text: "Por favor espere",
            imageUrl: "https://www.epgdlaw.com/wp-content/uploads/2017/09/ajax-loader.gif",
            showConfirmButton: false,
            allowOutsideClick: false
          });
          this.fileUploadService
          .actualizarFoto( this.imagenSubir, tipo, id )
          .then( img => {
            Swal.close();
          }).catch( err => {
            //console.log(err);
            Swal.fire('Error', 'No se pudo subir la imagen 1', 'error');
          })
        }
        if (this.imagenSubir2 !== this.imagenRem) {
          Swal.fire({
            title: "Subiendo Imagenes",
            text: "Por favor espere",
            imageUrl: "https://www.epgdlaw.com/wp-content/uploads/2017/09/ajax-loader.gif",
            showConfirmButton: false,
            allowOutsideClick: false
          });
          this.fileUploadService
          .actualizarFoto2( this.imagenSubir2, tipo, id )
          .then( img => {
            Swal.close();
          }).catch( err => {
            //console.log(err);
            Swal.fire('Error', 'No se pudo subir la imagen 2', 'error');
          })
        }
        setTimeout(() => {
          this.router.navigateByUrl(`/dashboard/vista-empresas`);
          Swal.fire('Actualizado', `Se actualizo correctamente la planilla.`, 'success');
        }
        , 1000);
      }
      else{
        console.log('error')
      }
    }
  }

}
