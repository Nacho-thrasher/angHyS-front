import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Extintor } from 'src/app/models/extintor.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ExtintorService } from 'src/app/services/extintor.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-extintores',
  templateUrl: './extintores.component.html',
  styles: [
  ]
})
export class ExtintoresComponent implements OnInit, OnDestroy {

  public dtOptions: DataTables.Settings = {};
  public extintores: Extintor[] = [];
  public cargando: boolean = true;
  public imgSubs!: Subscription;

  constructor(private extintorService: ExtintorService,
            private modalImgService: ModalImgService,
            private busquedasService: BusquedasService) { }
  //destroy
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  //oninit
  ngOnInit(): void {
    //datatable options
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' }
    };
    //cargas
    this.cargarExtintores();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(400)
    ).subscribe(img => {
      this.cargarExtintores()
    });
  }
  //funcion
  cargarExtintores(){
    this.cargando = true;
    this.extintorService.cargarExtintores()
    .subscribe(extintor => {
      this.cargando = false;
      this.extintores = extintor;
      //console.log(extintor)
    })
  }
  //abrirModal
  abrirModal(extintor: Extintor){
    //console.log(extintor)
    this.modalImgService.abrirModal('extintores', extintor._id , extintor.img);
  }
  buscar(termino: string):any{
    if (termino.length === 0) {
      return this.cargarExtintores();
    }
    //console.log(termino);
    this.busquedasService.buscar('extintores', termino)
    .subscribe( (extintores: any) => {
      //console.log(resp);
      this.extintores = extintores;
      //console.log(extintores);
    })
  }
  //delete
  borrarExtintor(extintor:Extintor){
    //console.log(usuario)
    Swal.fire({
      title: 'Estas seguro?',
      text: `Se borrara Extintor: ${extintor.numeroSerie} - Marca: ${extintor.marca}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, Borrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.extintorService.borrarExtintor(extintor._id!)
        .subscribe(resp =>{
          Swal.fire(
            'Borrado!',
            `Extintor: ${extintor.numeroSerie} Marca: ${extintor.marca} fue eliminado.`,
            'success'
          ),
          this.cargarExtintores()
        })
      }
    })
  }

}