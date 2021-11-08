import { Component, OnInit } from '@angular/core';
//other imports
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa.model';
import { EmpresaService } from 'src/app/services/empresa.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { FileUploadService } from 'src/app/services/file-upload.service';

const base_url = environment.base_url;


@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styles: [
  ],
  styleUrls:['./empresas.component.css']
})
export class EmpresaComponent implements OnInit {

  public empresaForm!: FormGroup;
  public empresa: Empresa[] = [];
  public empresaSeleccionados?: Empresa;
//? imgs wid var
public imgViene!: string;
public imagenSubir!: File; //img1
public imagenRem!: File;
public imgTemp: any = null;

  constructor(private fb: FormBuilder,
    private empresaService: EmpresaService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private fileUploadService: FileUploadService) { }


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
      //*pdf img
      if (empresa.img === undefined || empresa.img === '') {
        this.imgViene = `${base_url}/cloudinary/empresas/no-image`
      }else{ this.imgViene = empresa.img; }
      //console.log(empresa);
      this.empresaSeleccionados = empresa;
      this.empresaForm.setValue({
        nombre,
        localidad,
        direccion
      })
    });
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
removeData() {
  if (this.empresaSeleccionados?.img === undefined) {
    this.imgViene = `${ base_url }/cloudinary/empresas/no-image`;
  }
  else{
    this.imgViene = this.empresaSeleccionados.img;
  }
  this.imagenSubir = this.imagenRem;
  $('#imagePreview')
  .css('background-image', `url(${this.imgViene})`);
  $('#imagePreview').hide();
  $('#imagePreview').fadeIn(650);
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
          .actualizarFoto( this.imagenSubir, 'empresas', this.empresaSeleccionados._id )
          .then( img => {
            setTimeout(() => {
              Swal.close();
              this.router.navigateByUrl(`/dashboard/empresas`)
            }
            , 400);
          }).catch( err => {
            //console.log(err);
            Swal.fire('Error', 'No se pudo subir la imagen 1', 'error');
          })
        }
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
