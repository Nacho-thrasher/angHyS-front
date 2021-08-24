import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-img',
  templateUrl: './modal-img.component.html',
  styles: [
  ],
  styleUrls: [
    './modal-img.component.css'
  ]
})
export class ModalImgComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = null;
  public imagenRem!: File;

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
        $('#imagePreview')
        .css('background-image', 'url('+reader.result +')');
        $('#imagePreview').hide();
        $('#imagePreview').fadeIn(650);
        this.imgTemp = reader.result;
      }
      reader.readAsDataURL(file);
      //console.log(this.modalImgService.tipo);
    }

  }
  removeDataImg1() {
    this.imagenSubir = this.imagenRem;
    $('#imagePreview')
    .css('background-image', `url(${this.modalImgService.img})`);
    $('#imagePreview').hide();
    $('#imagePreview').fadeIn(650);
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
