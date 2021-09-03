import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImgService } from 'src/app/services/modal-img.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';
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
  public imgViene!: string;
  public usuario!: Usuario;

  constructor(public modalImgService: ModalImgService,
            public fileUploadService: FileUploadService,
            public sidebarService: SidebarService,
            public usuarioService: UsuarioService) { }

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

  noImagen(){
    if (this.imagenSubir === this.imagenRem) {
      return true
    }
    else{
      return false;
    }
  }

  subirImagen() {

    const id = this.modalImgService.id;
    const tipo = this.modalImgService.tipo;

    this.fileUploadService
    .actualizarFoto( this.imagenSubir, tipo, id )
    .then( img => {
        this.modalImgService.nuevaImagen.emit(img);
        setTimeout(() => {
          Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
          this.imagenSubir = this.imagenRem;
          this.cerrarModal();
        }
        
        , 900);
    }).catch( err => {
      //console.log(err);
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
    })
  }

}
