import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private usuarioService:UsuarioService,
              private router:Router){}

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.usuarioService.token === undefined || this.usuarioService.token === '') {
      //console.log(this.usuarioService.role)
      return true;
    }
    else{
      return this.usuarioService.validarToken().pipe(
        tap(estaAutenticado =>{

          if (!estaAutenticado) {
              this.router.navigateByUrl('/login');
              //this.router.navigateByUrl('/');
              //todo que es tap
          }
          //console.log(estaAutenticado)
          //console.log(this.usuarioService.usuario)
        })
      )
    }

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot){

    if (this.usuarioService.token === undefined || this.usuarioService.token === '') {
      return true;
    }
    else{
      return this.usuarioService.validarToken().pipe(
        tap(estaAutenticado =>{

          if (!estaAutenticado) {
              this.router.navigateByUrl('/login');
              //todo que es tap
          }

        })
      )
    }
  }

}
