import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa.model';
import { Extintor } from 'src/app/models/extintor.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ExtintorService } from 'src/app/services/extintor.service';
import Swal from 'sweetalert2';

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

  ngOnInit(): void {

    this.activatedRouter.params.subscribe(({id}) =>{
      this.cargarExtintor(id);
    })

    this.extintorForm = this.fb.group({
      numeroSerie: ['', Validators.required],
      marca: ['', Validators.required],
      agenteExtintor: ['', Validators.required],
      capacidad: ['', Validators.required],
      empresa: ['', Validators.required],
    })

    this.cargarEmpresas();
    this.extintorForm.get('empresa')?.valueChanges
    .subscribe(empresaId =>{
      this.empresaSeleccionados = this.empresas
      .find( h => h._id === empresaId);

    })
  }

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
      //console.log(extintor)
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

  cargarEmpresas(){
    this.empresaService.cargarEmpresas()
    .subscribe((empresas: Empresa[]) => {
      //console.log(empresas);
      this.empresas = empresas;
    })
  }

  guardarExtintor(){
    const { numeroSerie, marca } = this.extintorForm.value;
    if (this.extintorSeleccionados) {
        //update
        const data = {
          ...this.extintorForm.value,
          _id: this.extintorSeleccionados._id
        }
        this.extintorService.actualizarExtintor(data)
        .subscribe(resp =>{
          Swal.fire('Actualizado', `Extintor: ${numeroSerie} - Marca: ${marca}.`, 'success')
        })
    }
    else{
        //crear
        const { numeroSerie, marca } = this.extintorForm.value;
        this.extintorService.crearExtintor(this.extintorForm.value)
        .subscribe( (resp:any) => {
          Swal.fire('Creado', `Extintor: ${numeroSerie} - Marca: ${marca}.`, 'success')
          this.router.navigateByUrl(`/dashboard/extintor/${ resp.extintor._id }`)
        })
    }


  }



}
