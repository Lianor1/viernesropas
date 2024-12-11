import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-vaucher-detalle',
  templateUrl: './vaucher-detalle.page.html',
  styleUrls: ['./vaucher-detalle.page.scss'],
})
export class VaucherDetallePage implements OnInit {
  vaucher: any;
  vaucherId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private supabase: SupabaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vaucherId = id;
      await this.cargarVaucher();
    } else {
      const toast = await this.toastCtrl.create({
        message: 'No se encontró el vaucher',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
      this.router.navigate(['/compras']);
    }
  }

  async cargarVaucher() {
    if (!this.vaucherId) return;

    const loading = await this.loadingCtrl.create({
      message: 'Cargando vaucher...'
    });

    try {
      await loading.present();
      this.vaucher = await this.supabase.obtenerVaucherPorId(this.vaucherId);
    } catch (error) {
      console.error('Error al cargar vaucher:', error);
      const toast = await this.toastCtrl.create({
        message: 'Error al cargar el vaucher',
        duration: 2000,
        color: 'danger'
      });
      toast.present();
    } finally {
      loading.dismiss();
    }
  }

  async downloadAsPDF() {
    const loading = await this.loadingCtrl.create({
      message: 'Generando PDF...'
    });
    await loading.present();

    try {
      const element = document.getElementById('vaucher-content');
      if (!element) {
        throw new Error('Elemento no encontrado');
      }

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
      pdf.save(`vaucher_${this.vaucher.numero_vaucher}.pdf`);

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