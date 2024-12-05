import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Share } from '@capacitor/share';
import { PrintService } from '../services/print.service';
import { SupabaseService } from '../services/supabase.service';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-vaucher',
  templateUrl: './vaucher.page.html',
  styleUrls: ['./vaucher.page.scss'],
})
export class VaucherPage implements OnInit {
  cartItems: any[] = [];
  total: number = 0;
  voucherNumber: string;
  currentDate: Date = new Date();
  voucherGuardado: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private printService: PrintService,
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.voucherNumber = 'V-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    if (this.router.getCurrentNavigation()?.extras.state) {
      const state = this.router.getCurrentNavigation()?.extras.state as any;
      this.cartItems = state.cartItems || [];
      this.calculateTotal();
    }
  }

  ngOnInit() {
    // Removemos el guardado automático
  }

  calculateTotal() {
    this.total = this.cartItems.reduce((sum, item) => {
      return sum + (item.precio * item.quantity);
    }, 0);
  }

  async printVoucher() {
    // Primero guardamos el voucher si no se ha guardado
    if (!this.voucherGuardado) {
      await this.guardarVoucherEnBD();
    }
    
    const content = `
      <h1 style="text-align: center;">Voucher de Compra</h1>
      <p style="text-align: center;">Voucher #${this.voucherNumber}</p>
      <p style="text-align: center;">${this.currentDate.toLocaleDateString()} ${this.currentDate.toLocaleTimeString()}</p>
      
      <h2>Detalle de Productos</h2>
      ${this.cartItems.map(item => `
        <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
          <h3>${item.nombre}</h3>
          <p>Color: ${item.color}</p>
          <p>Talla: ${item.tallas}</p>
          <p>Cantidad: ${item.quantity}</p>
          <p>Precio Unitario: S/ ${item.precio}</p>
          <p>Precio Total: S/ ${item.precio * item.quantity}</p>
        </div>
      `).join('')}
      
      <div style="margin-top: 20px; text-align: right;">
        <h2>Total a Pagar: S/ ${this.total}</h2>
      </div>
    `;
    
    this.printService.print(content);
  }

  async shareVoucher() {
    // Primero guardamos el voucher si no se ha guardado
    if (!this.voucherGuardado) {
      await this.guardarVoucherEnBD();
    }

    try {
      await Share.share({
        title: 'Mi Voucher de Compra',
        text: `Voucher #${this.voucherNumber}\nTotal: S/ ${this.total}`,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  }

  private async guardarVoucherEnBD() {
    const loading = await this.loadingCtrl.create({
      message: 'Guardando voucher...'
    });
    
    try {
      await loading.present();
      
      const usuario = await this.supabase.getCurrentUser();
      if (!usuario) throw new Error('No hay usuario autenticado');

      const voucherData = {
        numero_voucher: this.voucherNumber,
        fecha: this.currentDate.toISOString(),
        total: this.total,
        items: this.cartItems,
        usuario_id: usuario.id
      };

      await this.supabase.guardarVoucher(voucherData);
      this.voucherGuardado = true; // Marcamos que ya se guardó
      
      const toast = await this.toastCtrl.create({
        message: 'Voucher guardado exitosamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();
      
    } catch (error) {
      console.error('Error al guardar el voucher:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al guardar el voucher',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }

  goHome() {
    this.router.navigate(['/home']);
  }

  // Método para descargar como PDF
  public async downloadAsPDF() {
    const loading = await this.loadingCtrl.create({
      message: 'Generando PDF...'
    });
    await loading.present();

    try {
      const canvas = await html2canvas(this.vaucherContent.nativeElement);
      const imageData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
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
}