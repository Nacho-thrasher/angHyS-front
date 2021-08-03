import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { filter, map, retry, take } from "rxjs/operators";

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy {

  public intervalSubs: Subscription;

  constructor() {
    // this.retornaObserver().pipe(
    //   retry()
    // ).subscribe(
    //   valor=>console.log('suvs', valor),
    //   error => console.warn('error', error),
    //   () => console.info('obs termin')
    // );
    this.intervalSubs = this.retornaInterval()
    .subscribe(console.log)

  }
  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaInterval(): Observable<Number>{
    //pipe es como un enganche se puede transformar si no tmb
    //reintentar etc es algo q se hace antes como un if
    return interval(500).pipe(
      map(valor => valor+1),
      //map puede cambiar el valor
      filter(valor => ( valor % 2 == 0 ) ? true : false),
      //filtrar tiene un predicado el cual es el condicional para q pase
      take(10)
      //take toma cantidad q le ordeno
    );
    // El orden dentro del pipe es lineal revisar
  }

  retornaObserver(): Observable<number>{
    let i = 0;

    return new Observable<number>( observer =>{

      const intervalo = setInterval(()=>{
        i++;
        observer.next(i)
        if(i === 4){
          clearInterval(intervalo);
          observer.complete();
        }
        if(i == 1){
          observer.error('i')
        }
      }, 1000)

    });
  }

}
