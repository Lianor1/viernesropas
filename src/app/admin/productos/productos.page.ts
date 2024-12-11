import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Producto } from './interfaces/producto.interface';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
})
export class ProductosPage implements OnInit {
  componenteActual: 'lista' | 'agregar' | 'editar' | 'eliminar' = 'lista';
  productos: Producto[] = [];
  productoParaEditar: Producto | null = null;

  constructor(
    private supabase: SupabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.componenteActual = 'lista';
    this.cargarProductos();
  }

  async cargarProductos() {
    try {
      const productos = await this.supabase.obtenerProductos();
      if (Array.isArray(productos)) {
        this.productos = productos;
      }
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  mostrarComponente(componente: 'lista' | 'agregar' | 'editar' | 'eliminar') {
    this.componenteActual = componente;
    this.productoParaEditar = null;
  }

  seleccionarProducto(producto: Producto) {
    this.productoParaEditar = producto;
    this.componenteActual = 'editar';
  }

  async confirmarEliminarProducto(producto: Producto) {
    // Implementar lógica de eliminación
    console.log('Eliminar producto:', producto);
  }

  actualizarLista() {
    this.cargarProductos();
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
