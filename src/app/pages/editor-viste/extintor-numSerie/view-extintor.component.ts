import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { Usuario } from 'src/app/models/usuario.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ExtintorService } from 'src/app/services/extintor.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-extintor',
  templateUrl: './view-extintor.component.html',
  styles: [
  ]
})
export class ViewExtintorComponent implements OnInit {

  public extintorForm!: FormGroup;
  public empresas: Empresa[] = [];
  public empresaSeleccionados?: Empresa;
  public extintor!: Extintor;
  public cargando?: boolean = true;
  public extintorSeleccionados?: Extintor;
  //? variables par aguardar al cargar
  public isUser!:boolean;

  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private extintorService: ExtintorService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private usuarioService: UsuarioService
  ) { }

  //todo OnInit
  ngOnInit(): void {
    //todo obtener parametro url
    this.activatedRouter.params
    .subscribe( ({numSerie}) => {
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

  //* Cargar extintor
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
      console.log(resp.extintor);
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

    })
  }
  //? end cargar forms, y extintor
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
    if (this.usuarioService.role === 'USER_ROLE') {
      Swal.fire('No autorizado', ``, 'error');
      return;
    }
    else{
      if (this.extintorSeleccionados) {
        //todo update
        const data = {
          ...this.extintorForm.value,
          _id: this.extintorSeleccionados._id,
          empresa: this.extintorSeleccionados.empresa._id
        }
        console.log(data);
        this.extintorService.actualizarExtintor(data)
        .subscribe(resp =>{
          Swal.fire('Actualizado', `Se actualizo correctamente la planilla.`, 'success')
          this.router.navigateByUrl(`/dashboard/vista-empresas`)
        })
      }
      else{
        console.log('error')
      }
    }
  }

}
