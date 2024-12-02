import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  totalHombre: number = 0;
  totalMujer: number = 0;
  totalNino: number = 0;
  totalAccesorios: number = 0;

  constructor(private supabase: SupabaseService) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  async cargarEstadisticas() {
    try {
      const { data, error } = await this.supabase.obtenerEstadisticasProductos();
      if (error) throw error;

      // Procesar los datos
      data.forEach((item: any) => {
        switch (item.categoria) {
          case 'hombre':
            this.totalHombre = item.count;
            break;
          case 'mujer':
            this.totalMujer = item.count;
            break;
          case 'nino':
            this.totalNino = item.count;
            break;
          case 'accesorios':
            this.totalAccesorios = item.count;
            break;
        }
      });
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  async logout() {
    await this.supabase.logout();
  }
}

