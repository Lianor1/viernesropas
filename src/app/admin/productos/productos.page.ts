import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { ToastController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage {
  producto = {
    codigo: '',
    nombre: '',
    descripcion: '',
    precio: 0,
    color: '',
    tallas: [],
    categoria: '',
  };

  imagenFile: File | null = null;
  imagenPreview: string | null = null;

  constructor(
    private supabase: SupabaseService,
    private router: Router,
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

  async logout() {
    try {
      await this.supabase.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
