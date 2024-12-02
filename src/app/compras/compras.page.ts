import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, LoadingController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.page.html',
  styleUrls: ['./compras.page.scss'],
})
export class ComprasPage implements OnInit {
  vouchers: any[] = [];

  constructor(
    private supabase: SupabaseService,
    private router: Router,
    private menuCtrl: MenuController,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
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

      this.vouchers = await this.supabase.obtenerVouchersPorUsuario(usuario.id);
    } catch (error) {
      console.error('Error al cargar compras:', error);
    } finally {
      loading.dismiss();
    }
  }

  verDetalles(voucher: any) {
    this.router.navigate(['/vaucher'], {
      state: { 
        voucherData: voucher
      }
    });
  }
}
