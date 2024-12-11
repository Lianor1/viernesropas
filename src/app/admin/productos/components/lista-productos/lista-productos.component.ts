import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Producto } from '../../interfaces/producto.interface';
import { SupabaseService } from 'src/app/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.scss']
})
export class ListaProductosComponent implements OnInit {
  @Input() productos: Producto[] = [];
  @Output() seleccionarProducto = new EventEmitter<Producto>();
  @Output() eliminarProducto = new EventEmitter<Producto>();

  private productoSeleccionado: Producto | null = null;

  constructor(private supabaseService: SupabaseService, private router: Router) {}

  ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const { data, error } = await this.supabaseService.getProductos();
      if (error) throw error;
      this.productos = data || [];
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  async onSeleccionar(producto: Producto) {
    if (this.productoSeleccionado && this.productoSeleccionado !== producto) {
      if (confirm('¿Desea cambiar al nuevo producto?')) {
        // Deselecciona el producto anterior
        this.productoSeleccionado = null;
        
        // Recargar los datos del nuevo producto
        try {
          const { data, error } = await this.supabaseService.getProductos();
          if (error) throw error;
          this.productos = data || [];
          
          // Selecciona el nuevo producto después de recargar
          this.productoSeleccionado = this.productos.find(p => p.id === producto.id) || producto;
          this.seleccionarProducto.emit(this.productoSeleccionado);
          
          // Navega al componente de edición con el ID del producto
          this.router.navigate(['/productos/editar-producto', this.productoSeleccionado.id]);
        } catch (error) {
          console.error('Error al recargar productos:', error);
        }
      }
    } else {
      // Si es la primera selección
      try {
        const { data, error } = await this.supabaseService.getProductos();
        if (error) throw error;
        this.productos = data || [];
        
        // Selecciona el producto después de recargar
        this.productoSeleccionado = this.productos.find(p => p.id === producto.id) || producto;
        this.seleccionarProducto.emit(this.productoSeleccionado);
        
        // Navega al componente de edición con el ID del producto
        this.router.navigate(['/productos/editar-producto', this.productoSeleccionado.id]);
      } catch (error) {
        console.error('Error al recargar productos:', error);
      }
    }
  }

  isEditing(producto: Producto): boolean {
    return this.productoSeleccionado?.id === producto.id;
  }

  onEliminar(producto: Producto) {
    this.eliminarProducto.emit(producto);
  }
}