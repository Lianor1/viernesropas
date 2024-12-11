import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import { LoadingController, ToastController } from '@ionic/angular';
import { CartService } from '../services/cart.service';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-vaucher',
  templateUrl: './vaucher.page.html',
  styleUrls: ['./vaucher.page.scss'],
})
export class VaucherPage implements OnInit {
  @ViewChild('vaucherContent', { static: true }) vaucherContent!: ElementRef;
  
  cartItems: any[] = [];
  total: number = 0;
  vaucherNumber: string;
  currentDate: Date = new Date();
  vaucherGuardado: boolean = false;

  constructor(
    private router: Router,
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private cartService: CartService
  ) {
    this.vaucherNumber = 'V-' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  ngOnInit() {
    console.log('Iniciando VaucherPage');
    
    const vaucherData = this.cartService.getVaucherData();
    console.log('Datos del vaucher obtenidos:', vaucherData);
    
    if (!vaucherData || !vaucherData.cartItems || vaucherData.cartItems.length === 0) {
      console.log('No hay datos de vaucher, redirigiendo...');
      this.router.navigate(['/carrito']);
      return;
    }
    
    this.cartItems = vaucherData.cartItems;
    this.total = vaucherData.total;
  }

  // Guardar en base de datos
  async guardarVaucherEnBD() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando vaucher...'
    });
    
    try {
      await loading.present();
      const usuario = await this.supabase.getCurrentUser();
      if (!usuario) throw new Error('No hay usuario autenticado');

      const vaucherData = {
        numero_vaucher: this.vaucherNumber,
        fecha: this.currentDate.toISOString(),
        total: this.total,
        items: this.cartItems,
        usuario_id: usuario.id
      };

      await this.supabase.guardarVaucher(vaucherData);
      this.vaucherGuardado = true;
      
      const toast = await this.toastCtrl.create({
        message: 'Vaucher guardado exitosamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      
    } catch (error) {
      console.error('Error al guardar el vaucher:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al guardar el vaucher',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }
  // Método para descargar como PDF
  public async downloadAsPDF() {
    const loading = await this.loadingCtrl.create({
      message: 'Generando PDF...'
    });
    await loading.present();

    try {
      // Primero guardamos en la BD si no se ha guardado
      if (!this.vaucherGuardado) {
        await this.guardarVaucherEnBD();
      }

      const canvas = await html2canvas(this.vaucherContent.nativeElement);
      const imageData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`vaucher_${this.vaucherNumber}.pdf`);

      const toast = await this.toastCtrl.create({
        message: 'PDF descargado exitosamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      // Limpiar el carrito después de guardar y descargar
      this.cartService.clearCart();

    } catch (error) {
      console.error('Error al generar PDF:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al generar el PDF',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }

  async downloadImage() {
    const loading = await this.loadingCtrl.create({
      message: 'Preparando imagen...'
    });
    await loading.present();

    try {
      // Primero guardamos en la BD si no se ha guardado
      if (!this.vaucherGuardado) {
        await this.guardarVaucherEnBD();
      }

      const canvas = await html2canvas(this.vaucherContent.nativeElement);
      const imageData = canvas.toDataURL('image/jpeg', 1.0);
      
      const link = document.createElement('a');
      link.href = imageData;
      link.download = `vaucher_${this.vaucherNumber}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      const toast = await this.toastCtrl.create({
        message: 'Imagen descargada exitosamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      // Limpiar el carrito después de guardar y descargar
      this.cartService.clearCart();

    } catch (error) {
      console.error('Error al descargar la imagen:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al descargar la imagen',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }

  // Método para ir al home después de guardar/descargar
  async goHome() {
    // Si no se ha guardado el vaucher, guardarlo antes de ir al home
    if (!this.vaucherGuardado) {
      await this.guardarVaucherEnBD();
    }
    this.cartService.clearCart(); // Limpiar el carrito
    this.router.navigate(['/home']);
  }
}
