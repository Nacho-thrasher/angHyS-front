import { Component, OnDestroy, OnInit } from '@angular/core';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styles: [
  ]
})
export class EmpresasComponent implements OnInit, OnDestroy {

  constructor(private empresaService: EmpresaService,
            private modalImgService: ModalImgService,
            private busquedasService: BusquedasService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  public empresas?: Empresa[];
  public cargando?: boolean = true;
  public imgSubs!: Subscription;

  ngOnInit(): void {

    this.cargarEmpresas();
    this.imgSubs = this.modalImgService.nuevaImagen
    .pipe(
      delay(400)
    ).subscribe(img => {
      this.cargarEmpresas()
    });
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

  cargarEmpresas(){
    this.cargando = true;

    this.empresaService.cargarEmpresas()
    .subscribe(empresas=>{
      this.cargando = false;
      this.empresas = empresas;
    })
  }

  eliminarEmpresa(empresa: Empresa){
    this.empresaService.borrarEmpresa(empresa._id!)
    .subscribe(resp => {
      this.cargarEmpresas();
      Swal.fire('Guardado', empresa.nombre, 'success')
    })
  }

  abrirModal(empresa:Empresa) {
    console.log(empresa)
    this.modalImgService.abrirModal('empresas', empresa._id , empresa.img);
  }

}
