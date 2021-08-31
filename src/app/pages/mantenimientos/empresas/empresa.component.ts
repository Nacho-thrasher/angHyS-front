import { Component, OnInit } from '@angular/core';
//other imports
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styles: [
  ]
})
export class EmpresaComponent implements OnInit {

  public empresaForm!: FormGroup;
  public empresa: Empresa[] = [];
  public empresaSeleccionados?: Empresa;

  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }


  ngOnInit(): void {
    this.activatedRouter.params.subscribe(({id}) =>{
      this.cargarEmpresa(id);
    })
    this.empresaForm = this.fb.group({
      nombre: ['', Validators.required],
      localidad: ['', Validators.required],
      direccion: ['', Validators.required]
    })
  }

  cargarEmpresa(id:string){
    if (id === 'nuevo') {  return; }
    this.empresaService.cargarEmpresaById(id)
    .pipe(
      delay(100)
    ).subscribe(empresa => {
      if (!empresa) {
        this.router.navigateByUrl(`/dashboard/empresas`);
        return;
      }
      const {
            nombre,
            localidad,
            direccion
            } = empresa;
      //console.log(empresa);
      this.empresaSeleccionados = empresa;
      this.empresaForm.setValue({
        nombre,
        localidad,
        direccion
      })
    });
  }

  guardarEmpresa(){
    const { nombre, localidad } = this.empresaForm.value;
    if (this.empresaSeleccionados) {
        //update
        const data = {
          ...this.empresaForm.value,
          _id: this.empresaSeleccionados._id
        }
        this.empresaService.actualizarEmpresa(data)
        .subscribe(resp =>{
          Swal.fire('Actualizado', `Empresa: ${nombre} - Localidad: ${localidad}.`, 'success')
          this.router.navigateByUrl(`/dashboard/empresas`)
        })
    }
    else{
        //crear
        const { nombre, localidad } = this.empresaForm.value;
        this.empresaService.crearEmpresa(this.empresaForm.value)
        .subscribe( (resp:any) => {
          Swal.fire('Creado', `Empresa: ${nombre} - Localidad: ${localidad}.`, 'success')
          this.router.navigateByUrl(`/dashboard/empresa/${ resp.empresa._id }`)
        })
    }
  }

}
