import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../../../services/supabase.service';
import { ToastController, LoadingController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Producto } from '../../interfaces/producto.interface';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.scss']
})
export class EditarProductoComponent implements OnInit {
  @Output() productoActualizado = new EventEmitter<void>();
  @Input() productoSeleccionado: any;
  
  productoForm: FormGroup;
  imagenSeleccionada: string | null = null;
  imagenFile: File | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      color: ['', Validators.required],
      talla: ['', Validators.required],
      categoria: ['', Validators.required]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargarProducto(id);
    }
  }

  async cargarProducto(id: string) {
    try {
      const { data, error } = await this.supabase.getProductoById(id);
      if (error) throw error;
      if (data && !Array.isArray(data)) {
        this.productoForm.patchValue(data);
        this.imagenSeleccionada = data.imagen_url;
      }
    } catch (error) {
      console.error('Error al cargar producto:', error);
    }
  }

  seleccionarImagen() {
    this.fileInput.nativeElement.click();
  }

  manejarSeleccionArchivo(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagenSeleccionada = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  async onSubmit() {
    if (this.productoForm.valid) {
      try {
        const loading = await this.loadingController.create({
          message: 'Actualizando producto...'
        });
        await loading.present();

        let imagenUrl = this.productoForm.value.imagen_url;

        if (this.imagenFile) {
          const { url } = await this.supabase.subirImagen(this.imagenFile);
          imagenUrl = url;
        }

        const productoActualizado = {
          ...this.productoForm.value,
          imagen_url: imagenUrl
        };

        const id = this.route.snapshot.paramMap.get('id');
        if (!id) throw new Error('ID no encontrado');

        await this.supabase.actualizarProducto(
          id, 
          productoActualizado
        );

        await loading.dismiss();
        await this.presentToast('Producto actualizado exitosamente');
        this.productoActualizado.emit();

      } catch (error: any) {
        console.error('Error al actualizar producto:', error);
        const errorMessage = error.message || JSON.stringify(error);
        await this.presentToast(errorMessage);
      }
    }
  }

  private async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
