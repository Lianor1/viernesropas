import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';
import { CartService } from '../services/cart.service';
import { ThemeService } from '../services/theme.service';

interface Producto {
  id?: string;
  nombre: string;
  precio: number;
  categoria: string;
  imagen_url: string;
  descripcion?: string;
  color?: string;
  tallas?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categoriaActual: string = 'mujer';
  cartItemCount: number = 0;
  searchTerm: string = '';
  isDarkMode: boolean = false;

  constructor(
    private supabase: SupabaseService,
    private menuCtrl: MenuController,
    private router: Router,
    private cartService: CartService,
    private platform: Platform,
    private themeService: ThemeService
  ) {
    this.themeService.isDarkMode.subscribe(
      darkMode => this.isDarkMode = darkMode
    );
  }

  ngOnInit() {
    this.cargarProductos();
    this.cartService.getCartItemCount().subscribe((count: number) => {
      this.cartItemCount = count;
    });
  }

  async cargarProductos() {
    try {
      const { data: productos, error } = await this.supabase.getProductos();
      if (error) {
        console.error('Error al obtener productos:', error);
        return;
      }
      
      console.log('Productos cargados:', productos);
      
      this.productos = productos;
      console.log('Categoria actual:', this.categoriaActual);
      
      this.filtrarProductos(this.categoriaActual);
      console.log('Productos filtrados:', this.productosFiltrados);
      
    } catch (error) {
      console.error('Error al cargar productos:', error);
    }
  }

  filtrarProductos(categoria: string) {
    this.categoriaActual = categoria.toLowerCase();
    console.log('Filtrando por categoría:', this.categoriaActual);
    
    this.productosFiltrados = this.productos.filter(producto => {
      const coincide = producto.categoria.toLowerCase() === this.categoriaActual;
      console.log(`Producto ${producto.nombre}: categoria ${producto.categoria} - coincide: ${coincide}`);
      return coincide;
    });
  }

  addToCart(producto: Producto) {
    this.cartService.addItem(producto);
  }

  segmentChanged(event: any) {
    const categoria = event.detail.value;
    const categoriaMap: { [key: string]: string } = {
      'MUJERES': 'mujer',
      'HOMBRES': 'hombre',
      'NIÑOS': 'nino',
      'ACCESORIOS': 'accesorio'
    };
    
    const categoriaDB = categoriaMap[categoria.toUpperCase()] || categoria;
    this.filtrarProductos(categoriaDB);
  }

  buscarProductos() {
    const termino = this.searchTerm.trim().toLowerCase();

    if (!termino) {
      // Si el término de búsqueda está vacío, restaurar la categoría actual
      this.filtrarProductos(this.categoriaActual);
      return;
    }

    // Filtrar productos por el término de búsqueda
    this.productosFiltrados = this.productos.filter(producto => {
      return producto.nombre.toLowerCase().includes(termino) || 
             producto.id?.toString().includes(termino);
    });
  }

  handleImageError(event: any) {
    event.target.src = 'assets/images/default-product.png';
  }

  async logout() {
    try {
      await this.supabase.logout();
      this.cartService.clearCart();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  toggleTheme() {
    this.themeService.toggleDarkMode();
  }
}
