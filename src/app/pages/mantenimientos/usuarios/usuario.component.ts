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

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRouter.params.subscribe(({id}) =>{
      this.cargarUsuario(id);
    })
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required]
    })
  }

  cargarUsuario(id:string){
    if (id === 'nuevo') {  return; }
    this.usuarioService.cargarUsuarioById(id)
    .pipe(
      delay(100)
    ).subscribe(usuario =>{
      if (!usuario) {
        this.router.navigateByUrl(`/dashboard/usuarios`);
        return;
      }
      const {
            nombre,
            email,
            role
            } = usuario;
      //console.log(usuario);
      this.usuarioSeleccionados = usuario;
      this.usuarioForm.setValue({
        nombre,
        email,
        role
      })
    });
  }

  guardarUsuario(){
    const { nombre, email } = this.usuarioForm.value;
    if (this.usuarioSeleccionados) {
        //update
        const data = {
          ...this.usuarioForm.value,
          _id: this.usuarioSeleccionados.uid
        }
        this.usuarioService.actualizarPerfil(data)
        .subscribe(resp =>{
          Swal.fire('Actualizado', `Nombre: ${nombre} - Email: ${email}.`, 'success')
          this.router.navigateByUrl(`/dashboard/usuarios`)
        })
    }
    else{
        //crear
        const { nombre, email } = this.usuarioForm.value;
        this.usuarioService.crearUsuario(this.usuarioForm.value)
        .subscribe( (resp:any) => {
          Swal.fire('Creado', `Nombre: ${nombre} - Email: ${email}.`, 'success')
          this.router.navigateByUrl(`/dashboard/usuario/${ resp.usuario.uid }`)
        })
    }
  }

}
