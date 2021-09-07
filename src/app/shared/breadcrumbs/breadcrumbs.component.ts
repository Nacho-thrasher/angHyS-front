import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ExtintorService } from 'src/app/services/extintor.service';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnDestroy{

  public titulo: string | undefined;
  public content: string | undefined;
  public tituloSub$: Subscription;
  public pathSub$: Subscription;
  public numS: string | undefined;
  public idExt: string | undefined;
  public nombreEmpr: string | undefined;
  public nombreEmprNoSpace: string | undefined;

  constructor(private router:Router,
              private activatedRouter: ActivatedRoute,
              private extintorService: ExtintorService
  )
  {
    this.tituloSub$ = this.getDataRuta().subscribe(
      ({titulo, content}) =>{
        this.titulo = titulo;
        document.title = `HyS - ${titulo}`;
        // instance
        this.content = content;
      }
    )
    this.pathSub$ = this.getPathRuta().subscribe(
      ({ id }) =>{
        this.idExt = id
        //console.log(this.numS)
        if (this.titulo === 'Vista Extintor') {
          this.cargarExtintor(this.idExt);
        }
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
  getPathRuta(){
    return this.router.events
      .pipe(
        // instance of ??, snapshot??
        filter((event): event is ActivationEnd => event instanceof ActivationEnd),
        filter((event: ActivationEnd) => event.snapshot.firstChild === null),
        map((event: ActivationEnd) => event.snapshot.params)
      )
  }
  cargarExtintor(id: any){
    if (this.titulo === 'Vista Extintor') {
      //console.log('bread',id);
      this.extintorService.cargarExtintorByIdExt(id)
      .subscribe( (resp:any) => {
        //console.log(resp)
        let {
          empresa: {_id, nombre}
        } = resp.extintor;
        this.nombreEmpr = nombre;
        this.nombreEmprNoSpace = nombre.replace(/ /g, "_");
        //console.log(this.nombreEmprNoSpace);
      })
    }
  }

}
