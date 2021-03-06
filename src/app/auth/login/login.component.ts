import { Component, NgZone, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const gapi:any;
declare var $: any;
declare var Jquery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;
  public googleUser = {};

  public loginForm = this.fb.group({
    password: ['' , [Validators.required]],
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.minLength(3), Validators.email]],
    remember: [false]
  } as AbstractControlOptions);

  constructor(private router:Router,
              private fb:FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    //this.renderButton();
    this.startApp2();
  }

  login(){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true,
      //timer: 3000,
    })
    Toast.fire({
      icon: 'success',
      title: 'Iniciando Sesion',
      width: 270,
      //padding: '3em',
    })
    this.usuarioService.loginUsuario(this.loginForm.value)
    .subscribe( resp =>{
      if(this.loginForm.get('remember')?.value){
        localStorage.setItem('email', this.loginForm.get('email')?.value);
      }
      else{
        localStorage.removeItem('email');
      }
      if (resp.ok) {
        this.router.navigateByUrl('dashboard/nosotros');
        setTimeout(() => {
          Toast.close();
        }
        , 500);
      }
    }, (err) =>{
      Swal.fire('Error', err.error.msg, 'error')
    });
  }

  // var id_token = googleUser.getAuthResponse().id_token;
  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'red'
    });
    this.startApp();
  }
  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  };

  attachSignin(element: HTMLElement | null) {

    this.auth2.attachClickHandler(element, {},
        (googleUser: { getAuthResponse: () => { (): any; new(): any; id_token: any; }; })=> {

          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token).subscribe(resp => {

            //todo redireccion y que es ngzone est
            this.ngZone.run( ()=>{


              this.router.navigateByUrl('/');

            })
          });

        },
        (error: any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

  async startApp2() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin2(document.getElementById('customBtn'));
  };

  attachSignin2(element: HTMLElement | null) {

    this.auth2.attachClickHandler(element, {},
        (googleUser: { getAuthResponse: () => { (): any; new(): any; id_token: any; }; })=> {

          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle(id_token).subscribe(resp => {

            //todo redireccion y que es ngzone est
            this.ngZone.run( ()=>{

              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timerProgressBar: true,
                //timer: 3000,
              })
              Toast.fire({
                icon: 'success',
                title: 'Iniciando Sesion',
                width: 270,
                //padding: '3em',
              })

              this.router.navigateByUrl('dashboard/nosotros');
              setTimeout(() => {
                Toast.close();
              }
              , 500);

            })
          });

        },
        (error: any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }



}
