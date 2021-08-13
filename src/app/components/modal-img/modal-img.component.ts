import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-img',
  templateUrl: './modal-img.component.html',
  styles: [
  ]
})
export class ModalImgComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null;

  constructor(public modalImgService: ModalImgService,
            public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.modalImgService.cerrarModal();
  }

  cambiarImagen(e: any):any {

    const file = e.target.files[0] || e.dataTransfer.files[0]
    if (file) {

      this.imagenSubir = file;

      if (!file) {
        return this.imgTemp = null;
      }
      const reader = new FileReader();
      reader.onloadend = () =>{
        this.imgTemp = reader.result;
      }
      reader.readAsDataURL(file);

    }

  }

  subirImagen() {

    const id = this.modalImgService.id;
    const tipo = this.modalImgService.tipo;

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, tipo, id )
      .then( img => {
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
        this.modalImgService.nuevaImagen.emit(img);
        this.cerrarModal();
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      })

  }

}