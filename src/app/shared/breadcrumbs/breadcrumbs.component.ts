import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy {

  public titulo: string | undefined;
  public content: string | undefined;
  public tituloSub$: Subscription;

  constructor(private router:Router) {

    this.tituloSub$ = this.getDataRuta().subscribe(
      ({titulo, content}) =>{
        this.titulo = titulo;
        document.title = `HyS - ${titulo}`;
        // instance
        this.content = content;
      }
    )

  }
  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
  }

  getDataRuta(){
    return this.router.events
      .pipe(
        // instance of ??, snapshot??
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.data)
      )


  }
}
