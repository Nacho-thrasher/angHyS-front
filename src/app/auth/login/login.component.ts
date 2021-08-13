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
    this.renderButton();
  }

  login(){
    //this.router.navigateByUrl('/');
    this.usuarioService.loginUsuario(this.loginForm.value).subscribe( resp =>{
      if(this.loginForm.get('remember')?.value){
        localStorage.setItem('email', this.loginForm.get('email')?.value);
      }
      else{
        localStorage.removeItem('email');
      }
      this.router.navigateByUrl('/');

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
      'theme': 'dark'
    });
    this.startApp();
  }
  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  };
  attachSignin(element: HTMLElement | null) {
    console.log(element?.id);
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

}
