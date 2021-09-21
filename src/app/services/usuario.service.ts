import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap, map, catchError, delay } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { CargarUsuario } from '../interfaces/cargar_usuarios.interface';
import { LoginFormInt } from '../interfaces/loginForm.interface';
import { RegisterForm } from '../interfaces/registerForm.interface';
import { Usuario } from '../models/usuario.model';
import { SidebarService } from './sidebar.service';

const base_url = environment.base_url;
declare const gapi: any;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  public auth2: any;
  public usuario!: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone,
    private sidebarService: SidebarService
  ){

      this.googleInit();

  }

  get token():string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {

    if (this.usuario.role === undefined || this.usuario.role === null) {
      return 'USER_ROLE';
    }
    else{
      return this.usuario.role!;
    }
  }

  get uid():string {
    return this.usuario.uid || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit(){

    return new Promise<void>(resolve => {

      gapi.load('auth2', () =>{
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '796413127660-tgktohi6gqfm0n183g1kqp6lqehl6ncq.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve();
      });
    })

  }

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then( () => {
      //todo averiguar q es ng zone
      this.ngZone.run(()=>{

        this.router.navigateByUrl('/login')
      })

    });
  }

  guardarLocalStorage(token:string, menu:any) {
    localStorage.setItem('token', token );
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  validarToken(): Observable<boolean> {
    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      //todo repasar aqui
      map( (resp:any)=>{
        const {email,google,nombre,role,uid,img = ''
        } = resp.usuario;

        this.usuario = new Usuario(nombre,email,'',img,google,role,uid
        );
        //console.log(this.usuario);
        this.guardarLocalStorage(resp.token, resp.menu);

        return true
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm){

    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) =>{
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    )

  }

  adminCreaUsers(data: any){
    return this.http.post(`${base_url}/usuarios`, data)
  }

  actualizarPerfil(data: {email: string, nombre: string, role?: string, password?: string}){

    data = {
      ...data,
      role: this.usuario.role
    }
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }
  //actualizarUsuario
  actualizarUsuario(usuario:Usuario){

    return this.http.put(`${base_url}/usuariosAdm/${usuario.uid}`, usuario, this.headers)
  }

  loginUsuario(formData: LoginFormInt){

    return this.http.post(`${base_url}/login`, formData).pipe(
      tap((resp: any) =>{
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    )

  }

  loginGoogle(token: any){

    return this.http.post(`${base_url}/login/google`, {token}).pipe(
      tap((resp: any) =>{
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    )

  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
    .pipe(
      map(resp=>{
        const usuarios = resp.usuarios.map(
          user =>new Usuario(
            user.nombre,
            user.email,
            '',
            user.img,
            user.google,
            user.role,
            user.uid
          )
        )
        return {
          total: resp.total,
          usuarios
        };
      })
    )
    //delay() , va con pipe antes de map para demorar la carga
  }
  cargarAllUsuarios(){

    const url = `${base_url}/usuarios`;
    return this.http.get<{ ok: boolean, usuarios: Usuario[] }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, usuarios: Usuario[] } ) => resp.usuarios)
    )
    //delay() , va con pipe antes de map para demorar la carga
  }

  cargarUsuarioById(id:string){

    const url = `${base_url}/usuario/${id}`;
    return this.http.get<{ ok: boolean, usuarios: Usuario }>(url, this.headers)
    .pipe(
      map((resp: { ok: boolean, usuarios: Usuario }) => resp.usuarios )
    )
  }

  eliminarUsuarios(usuario: Usuario){

    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);

  }

  guardarUsuario(usuario: Usuario){

    // data = {
    //   ...data,
    //   role: this.usuario.role
    // }
    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
  }

}
