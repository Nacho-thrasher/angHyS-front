import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {

  }
  isUFunc(){
    if (this.usuarioService.token === undefined || this.usuarioService.token === '') {
      return true;
    }
    if (this.usuarioService.role === 'USER_ROLE') {
      return true;
    }
    else{
      return false;
    }
  }

}
