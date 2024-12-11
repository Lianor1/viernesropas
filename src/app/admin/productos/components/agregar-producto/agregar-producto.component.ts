import { Component, Output, EventEmitter } from '@angular/core';
import { SupabaseService } from '../../../../services/supabase.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.scss']
})
export class AgregarProductoComponent {
  @Output() productoAgregado = new EventEmitter<void>();
  @Output() cerrarFormulario = new EventEmitter<void>();

  producto = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    color: '',
    tallas: [] as string[],
    categoria: '',
  };

  tallasSeleccionadas = {
    XS: false,
    S: false,
    M: false,
    L: false,
    XL: false,
    XXL: false
  };

  imagenFile: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private supabase: SupabaseService,
    private toastController: ToastController,
    private loadingController: LoadingController
  ) {}

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async agregarProducto() {
    try {
      if (!this.imagenFile) {
        throw new Error('Por favor seleccione una imagen');
      }

      const loading = await this.loadingController.create({
        message: 'Agregando producto...'
      });
      await loading.present();

      // Obtener las tallas seleccionadas antes de subir la imagen
      this.producto.tallas = this.getTallasSeleccionadas();

      // Subir imagen y obtener URL
      const { url } = await this.supabase.subirImagen(this.imagenFile);

      // Agregar producto con la URL de la imagen
      const productoCompleto = {
        ...this.producto,
        imagen_url: url
      };

      await this.supabase.agregarProducto(productoCompleto);
      await loading.dismiss();
      await this.presentToast('Producto agregado exitosamente');
      this.limpiarFormulario();
      
      // Emitir evento para actualizar la lista en el componente padre
      this.productoAgregado.emit();

    } catch (error: any) {
      console.error('Error al agregar producto:', error);
      await this.presentToast(error.message || 'Error al agregar producto');
    }
  }

  private limpiarFormulario() {
    this.producto = {
      codigo: '',
      nombre: '',
      descripcion: '',
      precio: 0,
      color: '',
      tallas: [],
      categoria: '',
    };
    this.imagenFile = null;
    this.imagenPreview = null;
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  removeImage() {
    this.imagenFile = null;
    this.imagenPreview = null;
  }

  compareWith(o1: any, o2: any) {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  }

  // Antes de enviar el formulario, convierte las selecciones a array
  private getTallasSeleccionadas(): string[] {
    return Object.entries(this.tallasSeleccionadas)
      .filter(([_, selected]) => selected)
      .map(([talla, _]) => talla);
  }


}
