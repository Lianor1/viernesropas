import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, LoadingController, ToastController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface Vaucher {
  id: string;
  fecha: string;
  total: number;
  vaucher_items: Array<{
    id: string;
    cantidad: number;
    precio_unitario: number;
    precio_total: number;
    color: string;
    talla: string;
    producto_nombre: string;
  }>;
}

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {
  vauchers: Vaucher[] = [];
  filtroFecha: string = 'all';

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    await this.cargarCompras();
  }

  // Observador para cambios en el filtro
  async onFiltroChange(event: any) {
    this.filtroFecha = event.detail.value;
    await this.cargarCompras();
  }

  async logout() {
    try {
      await this.supabase.logout();
      await this.menuCtrl.close();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  async cargarCompras() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando compras...'
    });

    try {
      await loading.present();
      const usuario = await this.supabase.getCurrentUser();
      if (!usuario) throw new Error('No hay usuario autenticado');

      // Calcular fechas según el filtro
      let fechaInicio: string | null = null;
      const fechaFin = new Date().toISOString();

      switch (this.filtroFecha) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          fechaInicio = today.toISOString();
          break;
        case 'week':
          const week = new Date();
          week.setDate(week.getDate() - 7);
          fechaInicio = week.toISOString();
          break;
        case 'month':
          const month = new Date();
          month.setMonth(month.getMonth() - 1);
          fechaInicio = month.toISOString();
          break;
        default: // 'all'
          fechaInicio = null;
      }

      this.vauchers = await this.supabase.obtenerVauchersPorUsuarioYFecha(
        usuario.id,
        fechaInicio,
        fechaFin
      );
    } catch (error) {
      console.error('Error al cargar compras:', error);
    } finally {
      loading.dismiss();
    }
  }

  async downloadPDF(event: Event, vaucher: Vaucher) {
    event.stopPropagation(); // Evita que se active el click del card
    const loading = await this.loadingCtrl.create({
      message: 'Generando PDF...'
    });
    await loading.present();

    try {
      const element = document.getElementById(`vaucher-${vaucher.id}`);
      if (!element) throw new Error('Elemento no encontrado');

      const canvas = await html2canvas(element);
      const imageData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imageData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`vaucher_${vaucher.id}.pdf`);

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

  async downloadImage(event: Event, vaucher: Vaucher) {
    event.stopPropagation();
    const loading = await this.loadingCtrl.create({
      message: 'Generando imagen...'
    });
    await loading.present();

    try {
      const element = document.getElementById(`vaucher-${vaucher.id}`);
      if (!element) throw new Error('Elemento no encontrado');

      const canvas = await html2canvas(element);
      const link = document.createElement('a');
      link.download = `vaucher_${vaucher.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      const toast = await this.toastCtrl.create({
        message: 'Imagen descargada exitosamente',
        duration: 2000,
        color: 'success'
      });
      toast.present();
    } catch (error) {
      console.error('Error al generar imagen:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al generar la imagen',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }

  verDetalles(vaucher: Vaucher) {
    this.router.navigate(['/vaucher-detalle'], {
      state: { vaucherData: vaucher }
    });
  }
}
