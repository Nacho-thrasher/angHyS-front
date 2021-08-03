import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncrementComponent } from './increment/increment.component';
import { FormsModule } from "@angular/forms";
import { ModalImgComponent } from './modal-img/modal-img.component';


@NgModule({
  declarations: [
    IncrementComponent,
    ModalImgComponent
  ],
  exports: [
    IncrementComponent,
    ModalImgComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ComponentsModule { }
