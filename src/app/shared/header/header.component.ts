import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent implements OnInit {

  addclass:any
  constructor(private router: Router) { }

  ngOnInit(): void {
    
  }

  buscar(termino:string){
    if (termino.length == 0) {
      return;
    }
    else{
      //console.log(termino, termino.length);
      this.router.navigateByUrl(`/dashboard/buscar/${termino}`)
    }
  }

}
