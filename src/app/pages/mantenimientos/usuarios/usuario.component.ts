import { Component, OnInit } from '@angular/core';
//other imports
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styles: [
  ]
})
export class UsuarioComponent implements OnInit {

  public usuarioForm!: FormGroup;
  public usuario: Usuario[] = [];
  public usuarioSeleccionados?: Usuario;
  //
  public changePass: boolean = false;
  public askNewUser!: boolean;

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(({id}) =>{
      if (id === 'nuevo') {
        this.askNewUser = true;
        this.usuarioForm = this.fb.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
          role: ['', Validators.required],
          password: ['', [Validators.required, Validators.minLength(4)]]
        })
      }
      else{
        this.cargarUsuario(id);
        this.usuarioForm = this.fb.group({
          nombre: ['', [Validators.required, Validators.minLength(3)]],
          email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
          role: ['', Validators.required]
        })
      }
    })
  }

  cargarUsuario(id:string){
    if (id === 'nuevo') {  return; }
    this.usuarioService.cargarUsuarioById(id).pipe(
      delay(100)
    ).subscribe(usuario =>{
      if (!usuario) {
        this.router.navigateByUrl(`/dashboard/usuarios`);
        return;
      }
      //console.log(usuario);
      const {
            nombre,
            email,
            role
      } = usuario;
      this.usuarioSeleccionados = usuario;
      this.usuarioForm.setValue({
        nombre,
        email,
        role
      })
    });
  }

  //todo other functions
  comprobar(campo: string){
    switch (campo) {
      case 'nombre':
        if (this.usuarioForm.get(campo)?.invalid) {
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
        if (this.usuarioForm.get(campo)?.invalid) {
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
        if (this.usuarioForm.get(campo)?.invalid) {
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
        if (this.usuarioForm.get(campo)?.invalid) {
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
      this.usuarioForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
        role: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(4)]]
      })
      let nombre = this.usuarioSeleccionados?.nombre;
      let email = this.usuarioSeleccionados?.email;
      let role = this.usuarioSeleccionados?.role;
      let password = ''
      this.usuarioForm.setValue({ nombre, email, role, password })
    }
    else if(this.changePass === true) {
      this.changePass = false;
      //? icono
      $(`#icon-btnPass`).removeClass('fa-check-square-o');
      $(`#icon-btnPass`).addClass('fa-square-o');
      //? validators
      this.usuarioForm = this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
        role: ['', Validators.required]
      })
      let nombre = this.usuarioSeleccionados?.nombre;
      let email = this.usuarioSeleccionados?.email;
      let role = this.usuarioSeleccionados?.role
      this.usuarioForm.setValue({ nombre, email, role })
    }
  }

  guardarUsuario(){
    const { nombre, email } = this.usuarioForm.value;
    if (this.usuarioSeleccionados) {
        //update
        const data = {
          ...this.usuarioForm.value,
          uid: this.usuarioSeleccionados.uid
        }
        this.usuarioService.actualizarUsuario(data)
        .subscribe(resp =>{
          Swal.fire('Actualizado', `Nombre: ${nombre} - Email: ${email}.`, 'success')
          this.router.navigateByUrl(`/dashboard/usuarios`)
        })
    }
    else{
      //* Crear
      //?form
      if(this.usuarioForm.invalid){ return; }
      //? creando
      const { nombre, email } = this.usuarioForm.value;
      //nuevo metodo
      this.usuarioService.adminCreaUsers(this.usuarioForm.value)
      .subscribe( (resp:any) => {
        //console.log(resp)
        Swal.fire('Creado', `Nombre: ${nombre} - Email: ${email}.`, 'success')
        this.router.navigateByUrl(`/dashboard/usuarios`)
      })
    }
  }

}
