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

interface UserProfile {
  id: string;
  nombre_completo: string;
  email: string;
  image: string | null;
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
  userProfile: UserProfile | null = null;
  defaultAvatarUrl = 'assets/default-avatar.png';
  showSnow: boolean = true;

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
    this.loadUserProfile();
  }

  ionViewWillEnter() {
    this.loadUserProfile();
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

  async loadUserProfile() {
    try {
      const user = await this.supabase.getCurrentUser();
      if (user) {
        // Primero intentamos obtener el perfil existente
        let { data, error } = await this.supabase.getClient()
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // Obtener el email del usuario actual
            const { data: userData, error: userError } = await this.supabase.getClient()
              .auth.getUser();

            if (userError) throw userError;

            // Extraer el nombre del email (todo lo que está antes del @)
            const userEmail = userData.user.email || '';
            const userName = userEmail.split('@')[0];
            // Capitalizar la primera letra y formatear el nombre
            const formattedName = userName
              .split('.')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');

            // Crear el perfil con el email y nombre formateado
            const newProfile = {
              id: user.id,
              email: userEmail,
              nombre_completo: formattedName, // Usar el nombre formateado
              image: null,
              created_at: new Date().toISOString()
            };

            const { data: insertedProfile, error: insertError } = await this.supabase.getClient()
              .from('profiles')
              .insert(newProfile)
              .select()
              .single();

            if (insertError) throw insertError;
            data = insertedProfile;
          } else {
            throw error;
          }
        }

        if (data) {
          // Verificar si data.image es una ruta completa o solo el nombre del archivo
          if (data.image) {
            if (!data.image.startsWith('http')) {
              console.log('Ruta de imagen original:', data.image);
              const { data: { publicUrl } } = this.supabase.getClient()
                .storage
                .from('avatars')
                .getPublicUrl(data.image);
              
              console.log('URL pública generada:', publicUrl);
              data.image = publicUrl;
            }
          }
          
          console.log('Perfil cargado:', data);
          this.userProfile = data;
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }

  getImageUrl(imagePath: string | null): string {
    if (!imagePath) {
      console.log('No hay imagen, usando default:', this.defaultAvatarUrl);
      return this.defaultAvatarUrl;
    }
    
    if (imagePath.startsWith('http')) {
      console.log('Usando URL directa:', imagePath);
      return imagePath;
    }
    
    console.log('Generando URL para:', imagePath);
    const { data: { publicUrl } } = this.supabase.getClient()
      .storage
      .from('avatars')
      .getPublicUrl(imagePath);
    
    console.log('URL generada:', publicUrl);
    return publicUrl;
  }

  goToProfile() {
    this.router.navigate(['/home/profiles']);
  }
}
