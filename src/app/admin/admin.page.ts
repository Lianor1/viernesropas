import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit, OnDestroy {
  private ventasPorCategoriaChart: Chart | undefined;
  private topProductosChart: Chart | undefined;

  // Definimos todas las propiedades que usamos en el template
  totalProductos: number = 0;
  
  productoMasVendido: {
    nombre: string;
    cantidadVendida: number;
  } = {
    nombre: '',
    cantidadVendida: 0
  };

  categoriaMasPopular: {
    nombre: string;
    totalVentas: number;
  } = {
    nombre: '',
    totalVentas: 0
  };

  categoriaDestacada: {
    nombre: string;
    ingresos: number;
  } = {
    nombre: '',
    ingresos: 0
  };

  comprasRecientes: CompraReciente[] = [];

  constructor(
    private router: Router,
    private supabase: SupabaseService
  ) {}

  async ngOnInit() {
    await this.cargarEstadisticas();
    this.crearGraficos();
  }

  async cargarEstadisticas() {
    try {
      // 1. Obtener total de productos
      const { data: productos, error: errorProductos } = await this.supabase
        .getClient()
        .from('productos')
        .select('count');
      
      if (errorProductos) throw errorProductos;
      this.totalProductos = productos[0].count;

      // 2. Obtener producto más vendido usando una función RPC
      const { data: productoVendido, error: errorVendido } = await this.supabase
        .getClient()
        .rpc('obtener_producto_mas_vendido');

      if (errorVendido) throw errorVendido;
      if (productoVendido && productoVendido[0]) {
        this.productoMasVendido = {
          nombre: productoVendido[0].producto_nombre,
          cantidadVendida: parseInt(productoVendido[0].total_vendido)
        };
      }

      // 3. Obtener categoría más popular usando una función RPC
      const { data: categoriaPopular, error: errorCategoria } = await this.supabase
        .getClient()
        .rpc('obtener_categoria_mas_popular');

      if (errorCategoria) throw errorCategoria;
      if (categoriaPopular && categoriaPopular[0]) {
        this.categoriaMasPopular = {
          nombre: categoriaPopular[0].categoria,
          totalVentas: parseInt(categoriaPopular[0].total_ventas)
        };
      }

      // 4. Obtener categoría con más ingresos usando una función RPC
      const { data: categoriaIngresos, error: errorIngresos } = await this.supabase
        .getClient()
        .rpc('obtener_categoria_mas_ingresos');

      if (errorIngresos) throw errorIngresos;
      if (categoriaIngresos && categoriaIngresos[0]) {
        this.categoriaDestacada = {
          nombre: categoriaIngresos[0].categoria,
          ingresos: parseFloat(categoriaIngresos[0].total_ingresos)
        };
      }

      // 5. Obtener datos para el gráfico usando una función RPC
      const { data: ventasPorCategoria, error: errorVentasCategoria } = await this.supabase
        .getClient()
        .rpc('obtener_ventas_por_categoria');

      if (errorVentasCategoria) throw errorVentasCategoria;
      if (ventasPorCategoria) {
        const labels: string[] = ventasPorCategoria.map((item: VentaCategoria) => item.categoria);
        const datos: number[] = ventasPorCategoria.map((item: VentaCategoria) => item.total_ventas);
        
        this.actualizarGrafico(labels, datos);
      }

      // Obtener compras recientes con datos del usuario
      const { data: compras, error: errorCompras } = await this.supabase
        .getClient()
        .from('vouchers')
        .select(`
          id,
          numero_voucher,
          fecha,
          total,
          usuario_id,
          user:usuario_id (
            email,
            raw_user_meta_data
          )
        `)
        .order('fecha', { ascending: false })
        .limit(10);

      if (errorCompras) throw errorCompras;

      if (compras) {
        this.comprasRecientes = compras.map(compra => {
          const email = compra.user?.[0]?.email || 'Sin email';
          const nombreUsuario = email.split('@')[0];

          return {
            iniciales: this.obtenerInicialesDesdeEmail(email),
            usuario: nombreUsuario,
            numeroVoucher: compra.numero_voucher,
            fecha: new Date(compra.fecha),
            total: compra.total
          };
        });
      }

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  }

  private actualizarGrafico(labels: string[], datos: number[]) {
    const ctx = document.getElementById('ventasPorCategoria') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Ventas por Categoría',
            data: datos,
            backgroundColor: [
              '#84cc16',
              '#22c55e',
              '#3b82f6',
              '#a855f7'
            ],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  crearGraficos() {
    // Crear gráfico de ventas por categoría
    const ctxVentas = document.getElementById('ventasPorCategoria') as HTMLCanvasElement;
    if (ctxVentas) {
      this.ventasPorCategoriaChart = new Chart(ctxVentas, {
        type: 'bar',
        data: {
          labels: ['Mujer', 'Hombre', 'Niños', 'Accesorios'],
          datasets: [{
            label: 'Ventas por Categoría',
            data: [450, 300, 200, 150],
            backgroundColor: [
              '#84cc16',
              '#22c55e',
              '#3b82f6',
              '#a855f7'
            ],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }

    // Crear gráfico de top productos
    const ctxTop = document.getElementById('topProductos') as HTMLCanvasElement;
    if (ctxTop) {
      this.topProductosChart = new Chart(ctxTop, {
        type: 'bar',
        data: {
          labels: ['Mujer', 'Hombre', 'Niños', 'Accesorios'],
          datasets: [{
            label: 'Ventas por Categoría',
            data: [450, 300, 200, 150],
            backgroundColor: [
              '#84cc16',
              '#22c55e',
              '#3b82f6',
              '#a855f7'
            ],
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  }

  ngOnDestroy() {
    // Destruir los gráficos cuando el componente se destruye
    if (this.ventasPorCategoriaChart) {
      this.ventasPorCategoriaChart.destroy();
    }
    if (this.topProductosChart) {
      this.topProductosChart.destroy();
    }
  }

  logout() {
    this.router.navigate(['/login']);
  }

  private obtenerInicialesDesdeEmail(email: string): string {
    const nombreUsuario = email.split('@')[0];
    return nombreUsuario
      .split(/[._-]/) // Dividir por puntos, guiones bajos o guiones
      .map(parte => parte[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

interface VentaCategoria {
  categoria: string;
  total_ventas: number;
}

interface IngresoCategoria {
  categoria: string;
  total_ingresos: number;
}

interface CompraReciente {
  iniciales: string;
  usuario: string;
  numeroVoucher: string;
  fecha: Date;
  total: number;
}

