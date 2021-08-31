import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormControl, FormGroup, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

declare var $: any;
declare var Jquery: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required]],
    password2: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.minLength(3), Validators.email]],
    terminos: [ false, Validators.requiredTrue]
  }, {
   validators: this.passwordIguales('password', 'password2')
  } as AbstractControlOptions);

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router:Router){ }

  ngOnInit(): void {
  }

  crearUsuario(){
    this.formSubmitted = true;
    //console.log(this.registerForm.value);

    if(this.registerForm.invalid){
      //console.log('form no correcto');
      return;
    }
    // realizar el posteo
    this.usuarioService.crearUsuario(this.registerForm.value)
    .subscribe( resp=> {
      //todo redireccion
      this.router.navigateByUrl('/');
    }, (err) => {
      //error sweetalert2
      Swal.fire('Error', err.error.msg, 'error')
    });

  }

  campoNoValido(campo: string): boolean {
    if(this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else{
      return false;
    }
  }

  contraseniaNoValidas(){
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if ((pass1 !== pass2) && this.formSubmitted) {
      return true;
    }
    else{
      return false
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  passwordIguales(pass1: string, pass2: string){
    return(formGroup: FormGroup) =>{
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);

      if (pass1Control?.value === pass2Control?.value) {
        pass2Control?.setErrors(null);
      }
      else{
        pass2Control?.setErrors({noEsIgual: true})
      }

    }
  }

}
