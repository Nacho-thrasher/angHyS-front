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

  public nomEmpr:String = '';
  public extintores: Extintor[] = [];
  public dtOptions: DataTables.Settings = {};

  constructor(private extintorService: ExtintorService,
    private activatedRoute: ActivatedRoute,
    private router: Router)
  { }

  //todo oninit
  ngOnInit(): void {
    //datatable options
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: { url: '//cdn.datatables.net/plug-ins/1.10.25/i18n/Spanish.json' }
    };
    //carga
    this.activatedRoute.params
    .subscribe( ({id}) => {
      this.cargarExtintoresByEmpresa(id);
    })
  }
  //* function cargar
  cargarExtintoresByEmpresa(id: string){
    this.extintorService.cargarExtintoresByEmpresa(id)
    .subscribe( (resp:any) => {

      if (resp.msg === 'no existe empresa') {
        this.router.navigateByUrl(`/dashboard/vista-empresas`);
        return;
      }
      //console.log(resp.nom);
      this.nomEmpr = resp.nom;
      this.extintores = resp.extintores;

    })
  }


}