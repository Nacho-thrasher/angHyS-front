import { Component, OnDestroy, OnInit } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';

import { Subject } from 'rxjs';

declare const $: any;
declare const jQuery: any;

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styles: [
  ]
})

export class EmpresasComponent implements OnInit, OnDestroy {

  public dtOptions: DataTables.Settings = {};
  public empresas?: Empresa[];
  public cargando?: boolean = true;
  public imgSubs!: Subscription;

  constructor(private empresaService: EmpresaService,
            private modalImgService: ModalImgService,
            private busquedasService: BusquedasService) { }

  //destroy
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }
  //oninit
  ngOnInit(): void {
    //datatables options
    this.dtOptions = {
      pagingType: 'full_numbers',
      processing: true,
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' }
    }
    //cargas
    this.cargarEmpresas();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(400)
    ).subscribe(img => {
      this.cargarEmpresas()
    });
    //
  }

  buscar(termino: string):any{
    if (termino.length === 0) {
      return this.cargarEmpresas();
    }
    //console.log(termino);
    this.busquedasService.buscar('empresas', termino)
    .subscribe( (empresas: any) => {
      //console.log(resp);
      this.empresas = empresas;
    })

  }
  //funcion
  cargarEmpresas(){
    //preload
    this.cargando = true;
    //funcion
    this.empresaService.cargarEmpresas()
    .subscribe(empresas=>{
      this.cargando = false;
      this.empresas = empresas;
    })
  }
  //delete
  eliminarEmpresa(empresa: Empresa){
    this.empresaService.borrarEmpresa(empresa._id!)
    .subscribe(resp => {
      this.cargarEmpresas();
      Swal.fire('Guardado', empresa.nombre, 'success')
    })
  }
  //modal cambiarImagen
  abrirModal(empresa:Empresa) {
    console.log(empresa)
    this.modalImgService.abrirModal('empresas', empresa._id , empresa.img);
  }

}
