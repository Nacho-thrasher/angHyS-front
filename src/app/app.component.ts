import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

import { NgxUiLoaderService } from 'ngx-ui-loader';

declare var $: any;
declare var Jquery: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HyS Matafuegos';

  constructor(private http: HttpClient,
    private ngxLoader: NgxUiLoaderService
  ){ }

  ngOnInit() {
    this.ngxLoader.start();
    // this.http.get(`https://api.npmjs.org/downloads/range/last-year/ngx-ui-loader`).subscribe((res: any) => {
    //   console.log(res);
    // });
    this.ngxLoader.stop();
  }

}
