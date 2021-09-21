import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { FileUploadService } from "../../services/file-upload.service";
import { SidebarService } from '../../services/sidebar.service';

const base_url = environment.base_url;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ],
  styleUrls: [
    "./perfil.component.css"
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = null;
  public imagenRem!: File;
  public rutaStart:string = base_url;
  public cargandoImg?: boolean = false;
  public imgPreCargada?:string;
  public changePass: boolean = false;

  constructor(private fb: FormBuilder,
      private usuarioService: UsuarioService,
      private fileUploadService: FileUploadService,
      private sidebarService : SidebarService,
      private router: Router) {
      }

  ngOnInit(): void {
      this.usuario = this.usuarioService.usuario;
      //console.log(this.usuario.img)
      if (this.usuario.img === undefined || this.usuario.img === '') {
        this.imgPreCargada = `${ base_url }/cloudinary/usuarios/no-image`;
      }
      else{
        this.imgPreCargada = this.usuario.img;
      }
      this.perfilForm = this.fb.group({
        nombre: [this.usuario.nombre, [Validators.required, Validators.minLength(3)]],
        email: [this.usuario.email, [Validators.required, Validators.email]]
      })
  }
  //todo repasar
  actualizarPerfil(){
    //console.log(this.perfilForm.value);
    this.usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(resp=>{
      const { nombre, email, password } = this.perfilForm.value;
      this.usuario.nombre = nombre;
      this.usuario.email = email;
      this.usuario.password = password;
      Swal.fire('Actualizado', 'Tus datos fueron actualizados', 'success');
    })
    // llamar aqui de nuevo form group
    //todo agregar sweet alert aqui
  }

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
  removeDataImg1() {
    this.imagenSubir = this.imagenRem;
    if (this.usuario.google === true) {
      $('#imagePreview')
      .css('background-image', `url(${this.imgPreCargada})`);
      $('#imagePreview').hide();
      $('#imagePreview').fadeIn(650);
    }
    else{
      $('#imagePreview')
      .css('background-image', `url(${this.imgPreCargada})`);
      $('#imagePreview').hide();
      $('#imagePreview').fadeIn(650);
    }
  }
  subirImagen() {
    this.fileUploadService.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
    .then( img => {

      this.imgPreCargada = img;
      this.usuario.img = img;
      Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      //this.router.navigateByUrl(`/dashboard/perfil`)
    }).catch( err => {
      console.log(err);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    })
    this.imgPreCargada = this.usuario.img;
    this.sidebarService.nuevaImagen.emit(this.usuario.img);
    this.usuarioService.nuevaImagen.emit(this.usuario.img)
    this.imagenSubir = this.imagenRem;
  }

  //todo other functions
  comprobar(campo: string){
    switch (campo) {
      case 'nombre':
        if (this.perfilForm.get(campo)?.invalid) {
          //? uplabel
          $(`#fb${campo}`).removeClass("has-success");
          $(`#fb${campo}`).addClass("has-danger");
          //? input
          $(`#${campo}`).removeClass("form-control-success");
          $(`#${campo}`).addClass("form-control-danger");
          //? feedback
          $(`#feedback-${campo}`).html("Nombre debe contener mas de 3 caracteres.")
        }
        else{
          //? uplabel
          $(`#fb${campo}`).removeClass("has-danger");
          $(`#fb${campo}`).addClass("has-success");
          //? input
          $(`#${campo}`).removeClass("form-control-danger");
          $(`#${campo}`).addClass("form-control-success");
          //? feedback
          $(`#feedback-${campo}`).html("Correcto!")
        }
        break;
      case 'email':
        if (this.perfilForm.get(campo)?.invalid) {
          //? uplabel
          $(`#fb${campo}`).removeClass("has-success");
          $(`#fb${campo}`).addClass("has-danger");
          //? input
          $(`#${campo}`).removeClass("form-control-success");
          $(`#${campo}`).addClass("form-control-danger");
          //? feedback
          $(`#feedback-${campo}`).html("Email debe ser valido y/o llevar formato @gmail.")
        }
        else{
          //? uplabel
          $(`#fb${campo}`).removeClass("has-danger");
          $(`#fb${campo}`).addClass("has-success");
          //? input
          $(`#${campo}`).removeClass("form-control-danger");
          $(`#${campo}`).addClass("form-control-success");
          //? feedback
          $(`#feedback-${campo}`).html("Correcto!")
        }
        break;
      case 'role':
        if (this.perfilForm.get(campo)?.invalid) {
          //? uplabel
          $(`#fb${campo}`).removeClass("has-success");
          $(`#fb${campo}`).addClass("has-danger");
          //? input
          $(`#${campo}`).removeClass("form-control-success");
          $(`#${campo}`).addClass("form-control-danger");
          //? feedback
          $(`#feedback-${campo}`).html("Role debe ser seleccionado.")
        }
        else{
          //? uplabel
          $(`#fb${campo}`).removeClass("has-danger");
          $(`#fb${campo}`).addClass("has-success");
          //? input
          $(`#${campo}`).removeClass("form-control-danger");
          $(`#${campo}`).addClass("form-control-success");
          //? feedback
          $(`#feedback-${campo}`).html("Correcto!")
        }
        break;
      case 'password':
        if (this.perfilForm.get(campo)?.invalid) {
          //? uplabel
          $(`#fb${campo}`).removeClass("has-success");
          $(`#fb${campo}`).addClass("has-danger");
          //? input
          $(`#${campo}`).removeClass("form-control-success");
          $(`#${campo}`).addClass("form-control-danger");
          //? feedback
          $(`#feedback-${campo}`).html("Contraseña debe contener 4 caracteres minimo.")
        }
        else{
          //? uplabel
          $(`#fb${campo}`).removeClass("has-danger");
          $(`#fb${campo}`).addClass("has-success");
          //? input
          $(`#${campo}`).removeClass("form-control-danger");
          $(`#${campo}`).addClass("form-control-success");
          //? feedback
          $(`#feedback-${campo}`).html("Correcto!")
        }
        break;
    }
  }

  //todo cambiar pass
  changePassword(){
    if(this.changePass === false) {
      this.changePass = true;
      //? icono
      $(`#icon-btnPass`).removeClass('fa-square-o');
      $(`#icon-btnPass`).addClass('fa-check-square-o');
      //? validators
      this.perfilForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
        password: ['', [Validators.required, Validators.minLength(4)]]
      })
      let nombre = this.usuario?.nombre;
      let email = this.usuario?.email;
      let password = ''
      this.perfilForm.setValue({ nombre, email, password })
    }
    else if(this.changePass === true) {
      this.changePass = false;
      //? icono
      $(`#icon-btnPass`).removeClass('fa-check-square-o');
      $(`#icon-btnPass`).addClass('fa-square-o');
      //? validators
      this.perfilForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.minLength(3), Validators.email]]
      })
      let nombre = this.usuario?.nombre;
      let email = this.usuario?.email;
      this.perfilForm.setValue({ nombre, email })
    }
  }

}
