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
  public numS!: string | undefined;
  public idExt!: string;
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
      ({ id_ext, id }) =>{
        this.idExt = id_ext
        if (this.idExt !== undefined) {
          //console.log(this.idExt);
          if (this.titulo === 'Vista Extintor') {
            this.cargarExtintor(this.idExt);
          }
        }
        if (id !== undefined) {
          if (this.titulo === 'Extintores' && this.content === 'Principal') {
            this.nombreEmpr = id;
            this.nombreEmprNoSpace = this.nombreEmpr!.replace(/_/g, " ");
          }
        }
        this.numS = '';

      }
    )

  }

  ngOnDestroy(): void {
    this.tituloSub$.unsubscribe();
    this.pathSub$.unsubscribe();
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

  cargarExtintor(id: string){
    if (this.titulo === 'Vista Extintor') {
      //console.log('bread',id);
      this.extintorService.cargarExtintorByIdExt(id)
      .subscribe( (resp:any) => {
        //console.log(resp)
        if (resp.extintor !== undefined) {
          //this.router.navigateByUrl(`/dashboard/vista-empresas`);
          let {
            numeroSerie,
            empresa: {_id, nombre}
          } = resp.extintor;
          this.numS = numeroSerie;
          this.nombreEmpr = nombre;
          this.nombreEmprNoSpace = nombre.replace(/ /g, "_");
          //console.log(this.nombreEmprNoSpace);
        }
      })
    }
  }

}
