import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-increment',
  templateUrl: './increment.component.html',
  styles: [
  ]
})
export class IncrementComponent implements OnInit {
  constructor() { }
  ngOnInit(){
    this.btnClass = `btn ${ this.btnClass}`
  }
  // inputs
  @Input('valor') progress: number = 0;
  @Input() btnClass: string = 'btn-primary';
  // outputs
  @Output() valorSalida: EventEmitter<number> = new EventEmitter();

  cambiarValor(valor: number){
    if(this.progress >= 100 && valor >= 0){
      this.valorSalida.emit(100);
      this.progress = 100;
      return;
    }
    if(this.progress <= 0 && valor < 0){
      this.valorSalida.emit(0);
      this.progress = 0;
      return;
    }
    this.progress = this.progress + valor
    this.valorSalida.emit( this.progress );
  }

  onChange(nuevoValor: number){

    if(nuevoValor >= 100){
      this.progress = 100;
    }
    else if(nuevoValor <= 0){
      this.progress = 0;
    }
    else{
      this.progress = nuevoValor;
    }
    this.valorSalida.emit(this.progress)

  }

}
