import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createClient, SupabaseClient, User, RealtimeClient } from '@supabase/supabase-js';
import { environment } from 'src/environments/environment';

interface UserMetadata {
  role?: string;
  nombres?: string;
  apellidos?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor(private router: Router) {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey
    );
  }

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      // Verificar si el usuario existe y tiene metadatos
      if (!data.user) {
        throw new Error('Usuario no encontrado');
      }

      console.log('Datos del login:', {
        user: data.user,
        metadata: data.user.user_metadata,
        session: data.session
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error detallado del login:', error);
      throw error;
    }
  }

  async registro(email: string, password: string, userData: { nombres: string, apellidos: string }) {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'usuario', // rol por defecto
            nombres: userData.nombres,
            apellidos: userData.apellidos
          }
        }
      });

      if (error) throw error;

      console.log('Registro exitoso:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    }
  }

  async verificarRol(): Promise<string | null> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      const metadata = user?.user_metadata as UserMetadata;
      return metadata?.['role'] || null;
    } catch (error) {
      console.error('Error al verificar rol:', error);
      return null;
    }
  }

  async subirImagen(file: File) {
    try {
      const rol = await this.verificarRol();
      if (rol !== 'admin') {
        throw new Error('Solo los administradores pueden subir imágenes');
      }

      const fileName = `${Date.now()}_${file.name}`;
      const { data, error } = await this.supabase.storage
        .from('productos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      const { data: { publicUrl } } = this.supabase.storage
        .from('productos')
        .getPublicUrl(fileName);

      return { url: publicUrl };
    } catch (error) {
      console.error('Error en subirImagen:', error);
      throw error instanceof Error ? error : new Error('Error desconocido al subir imagen');
    }
  }

  async diagnosticoCompleto() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      const { data: { user } } = await this.supabase.auth.getUser();
      const metadata = user?.user_metadata as UserMetadata;
      
      const { data: buckets } = await this.supabase.storage.listBuckets();
      const { data: files } = await this.supabase.storage
        .from('productos')
        .list();

      return {
        tieneSession: !!session,
        tieneUsuario: !!user,
        rol: metadata?.['role'],
        bucketExiste: buckets?.some(b => b.name === 'productos'),
        puedeListarArchivos: !!files
      };
    } catch (error) {
      console.error('Error en diagnóstico:', error);
      return {
        error: error instanceof Error ? error.message : 'Error desconocido',
        detalles: error
      };
    }
  }

  async logout() {
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  async getSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      console.error('Error al obtener sesión:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }

  obtenerUrlPublica(path: string) {
    const { data } = this.supabase.storage
      .from('productos')
      .getPublicUrl('173311220658_poncho.jpg');
    
    console.log('URL generada:', data.publicUrl);
    return data.publicUrl;
  }

  async agregarProducto(producto: any) {
    try {
      const session = await this.getSession();
      if (!session) {
        await this.router.navigate(['/login']);
        throw new Error('No hay sesión activa');
      }

      return await this.supabase
        .from('productos')
        .insert([producto])
        .select();
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }

  async obtenerEstadisticasProductos() {
    return await this.supabase
      .rpc('contar_productos_por_categoria');
  }

  async obtenerProductos() {
    try {
      const { data, error } = await this.supabase
        .from('productos')
        .select('*');
      
      if (error) throw error;

      data.forEach(producto => {
        console.log('URL de imagen actualizada:', producto.imagen_url);
      });

      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async actualizarRolUsuario(userId: string) {
    const { data, error } = await this.supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role: 'admin' } }
    );
    console.log('Actualización de rol:', data, error);
    return data;
  }

  async verificarYActualizarRolAdmin() {
    const { data: { user } } = await this.supabase.auth.getUser();
    console.log('Usuario actual:', user);
    console.log('Metadata actual:', user?.user_metadata);

    if (user && (!user.user_metadata?.['role'] || user.user_metadata['role'] !== 'admin')) {
      const { data, error } = await this.supabase.auth.updateUser({
        data: { role: 'admin' }
      });
      console.log('Actualización realizada:', data, error);
    }
  }

  async verificarBucketProductos() {
    try {
      const { data: buckets, error } = await this.supabase.storage.listBuckets();
      if (error) throw error;

      const existeBucket = buckets.some(bucket => bucket.name === 'productos');
      if (!existeBucket) {
        throw new Error('El bucket "productos" no existe');
      }

      console.log('El bucket "productos" está configurado correctamente');
    } catch (error) {
      console.error('Error en verificación de bucket:', error);
      throw error;
    }
  }

  async verificarEstadoBucket() {
    try {
      // Verificar si podemos listar archivos en el bucket
      const { data: files, error: listError } = await this.supabase.storage
        .from('productos')
        .list();

      console.log('Archivos en bucket:', files);
      console.log('Error al listar:', listError);

      // Intentar obtener los metadatos del bucket
      const { data: buckets, error: bucketError } = await this.supabase.storage
        .listBuckets();

      const productoBucket = buckets?.find(b => b.name === 'productos');
      console.log('Información del bucket productos:', productoBucket);
      
      return {
        bucketExists: !!productoBucket,
        isPublic: productoBucket?.public,
        files: files
      };
    } catch (error) {
      console.error('Error al verificar bucket:', error);
      throw error;
    }
  }

  async verificarRolUsuario() {
    const { data: { user } } = await this.supabase.auth.getUser();
    console.log('Usuario actual:', user);
    console.log('Metadata actual:', user?.user_metadata);

    if (user && (!user.user_metadata?.['role'] || user.user_metadata['role'] !== 'admin')) {
      const { data, error } = await this.supabase.auth.updateUser({
        data: { role: 'admin' }
      });
      console.log('Actualización realizada:', data, error);
    }
  }

  async obtenerImagenes() {
    try {
      const { data, error } = await this.supabase.storage
        .from('productos')
        .list();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener imágenes:', error);
      throw error;
    }
  }

  async eliminarImagen(path: string) {
    try {
      const rol = await this.verificarRol();
      if (rol !== 'admin') {
        throw new Error('Solo los administradores pueden eliminar imágenes');
      }

      const { error } = await this.supabase.storage
        .from('productos')
        .remove([path]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  }

  async guardarVoucher(voucherData: {
    numero_voucher: string;
    fecha: string;
    total: number;
    items: any[];
    usuario_id: string;
  }) {
    try {
      // Primero guardamos el voucher
      const { data: voucher, error: voucherError } = await this.supabase
        .from('vouchers')
        .insert([{
          numero_voucher: voucherData.numero_voucher,
          fecha: voucherData.fecha,
          total: voucherData.total,
          usuario_id: voucherData.usuario_id
        }])
        .select()
        .single();

      if (voucherError) throw voucherError;

      // Luego guardamos los items del voucher
      const voucherItems = voucherData.items.map(item => ({
        voucher_id: voucher.id,
        producto_nombre: item.nombre,
        color: item.color,
        talla: item.tallas,
        cantidad: item.quantity,
        precio_unitario: item.precio,
        precio_total: item.precio * item.quantity
      }));

      const { error: itemsError } = await this.supabase
        .from('voucher_items')
        .insert(voucherItems);

      if (itemsError) throw itemsError;

      return voucher;
    } catch (error) {
      console.error('Error al guardar el voucher:', error);
      throw error;
    }
  }

  async obtenerVouchersPorUsuario(usuarioId: string) {
    try {
      const { data, error } = await this.supabase
        .from('vouchers')
        .select(`
          *,
          voucher_items (*)
        `)
        .eq('usuario_id', usuarioId)
        .order('fecha', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener vouchers:', error);
      throw error;
    }
  }

  async getProductos() {
    return await this.supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false });
  }
} 