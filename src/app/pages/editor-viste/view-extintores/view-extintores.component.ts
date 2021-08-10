import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Extintor } from 'src/app/models/extintor.model';
import { ExtintorService } from 'src/app/services/extintor.service';

@Component({
  selector: 'app-view-extintores',
  templateUrl: './view-extintores.component.html',
  styles: [
  ]
})
export class ViewExtintoresComponent implements OnInit {

  constructor(private extintorService: ExtintorService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.params
    .subscribe( ({id}) => {
      this.cargarExtintoresByEmpresa(id);
    })

  }
  public nomEmpr:String = '';
  public extintores: Extintor[] = [];

  cargarExtintoresByEmpresa(id: string){
    this.extintorService.cargarExtintoresByEmpresa(id)
    .subscribe( (resp:any) => {

      if (resp.msg === 'no existe empresa') {
        this.router.navigateByUrl(`/dashboard/vista-empresas`);
        return;
      }
      //console.log(resp);
      this.nomEmpr = resp.nom;
      this.extintores = resp.extintores;

    })
  }


}
