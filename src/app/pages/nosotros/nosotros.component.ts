import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {


  }

  redes(red: string){
    switch (red){
      case 'facebook':
        document.location.href = 'https://www.facebook.com/matafuegoshys';
      break;
      case 'instagram':
        document.location.href = 'https://www.instagram.com/matafuegoshys/';
      break;
      case 'whatsapp':
        document.location.href = 'https://wa.me/5493876117573'
      break;
    }
  }
}
